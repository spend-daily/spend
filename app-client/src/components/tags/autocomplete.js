import React from 'react'
import { TextField } from 'material-ui'
import { MenuItem } from 'material-ui/Menu'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import { compose, graphql } from 'react-apollo'
import uuid from 'uuid/v4'

import { allTags, createTag, createTransactionTag } from './queries'

const styles = {
  listContainer: {
    position: 'absolute'
  },
  listStyle: {
    padding: '0',
    listStyle: 'none'
  }
}

class TagAutocomplete extends React.Component {
  state = {
    newTag: '',
    openOverride: false
  }

  onUpdateNewTag = event => {
    const newValue = event.target.value
    this.setState({
      newTag: newValue,
      showTags: !!newValue.length
    })
  }

  async tagTransaction(tagId) {
    return await this.props.createTransactionTag({
      variables: {
        transactionTag: {
          transactionTag: {
            tagId,
            transactionId: this.props.transactionId
          }
        }
      }
    })
  }

  onKeyUp = async event => {
    if (event.keyCode === 13) {
      const tagId = uuid()
      await this.props.createTag({
        variables: {
          tag: {
            tag: {
              id: tagId,
              label: this.state.newTag
            }
          }
        }
      })
      await this.tagTransaction(tagId)
      this.setState({
        newTag: '',
        showTags: false
      })

      this.props.refetchTransactions()
    }
  }

  onClick = tagId => async () => {
    await this.tagTransaction(tagId)

    this.setState({
      newTag: '',
      showTags: false
    })

    this.props.refetchTransactions()
  }

  onBlur = () => {
    this.setState({
      showTags: false
    })
  }

  onFocus = () => {
    this.setState({
      showTags: !!this.state.newTag.length
    })
  }

  render() {
    const { classes } = this.props
    const visibleTags = this.props.data.filter(
      tag => ~tag.label.toLowerCase().indexOf(this.state.newTag.toLowerCase())
    )
    return (
      <div>
        <TextField
          id="new-tag"
          label="New Tag"
          value={this.state.newTag}
          onBlur={this.onBlur}
          onChange={this.onUpdateNewTag}
          onKeyUp={this.onKeyUp}
          onFocus={this.onFocus}
        />
        {(this.state.showTags || this.state.openOverride) && (
          <Paper elevation={8} className={classes.listContainer}>
            <ul style={styles.listStyle}>
              {visibleTags.map(tag => (
                <MenuItem
                  key={tag.id}
                  component="li"
                  onMouseDown={this.onClick(tag.id)}
                >
                  {tag.label}
                </MenuItem>
              ))}
            </ul>
          </Paper>
        )}
      </div>
    )
  }
}

export default compose(
  graphql(allTags, {
    name: 'allTags'
  }),
  graphql(createTag, {
    name: 'createTag',
    options: props => ({
      variables: {
        tag: {
          tag: {
            ...props
          }
        }
      }
    })
  }),
  graphql(createTransactionTag, {
    name: 'createTransactionTag',
    options: props => ({
      variables: {
        transactionTag: {
          transactionTag: {
            ...props
          }
        }
      }
    })
  }),
  withStyles(styles)
)(props => {
  if (props.allTags.loading) return null
  const data = props.allTags.allTags.edges.map(edge => edge.node)
  return <TagAutocomplete {...props} data={data} />
})
