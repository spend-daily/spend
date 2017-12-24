import React from 'react'
import { TextField } from 'material-ui'
import { MenuItem } from 'material-ui/Menu'
import { compose, graphql } from 'react-apollo'
import uuid from 'uuid/v4'

import { allTags, createTag, createTransactionTag } from './queries'

const styles = {
  listStyle: {
    padding: '0 10px',
    position: 'absolute'
  }
}

class TagAutocomplete extends React.Component {
  state = {
    newTag: ''
  }

  onUpdateNewTag = event => {
    const newValue = event.target.value
    this.setState({
      newTag: newValue,
      showTags: !!newValue.length
    })
  }

  onKeyUp = async event => {
    if (event.keyCode === 13) {
      let tag = await this.props.createTag({
        variables: {
          tag: {
            tag: {
              id: uuid(),
              label: this.state.newTag
            }
          }
        }
      })
      this.setState({
        newTag: '',
        showTags: false
      })
    }
  }

  onClick = async tagId => {
    let tag = await this.props.createTransactionTag({
      variables: {
        transactionTag: {
          transactionTag: {
            tagId,
            transactionId: this.props.transactionId
          }
        }
      }
    })
    this.setState({ newTag: '' })
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
        {this.state.showTags && (
          <ul style={styles.listStyle}>
            {visibleTags.map(tag => (
              <MenuItem
                key={tag.id}
                component="li"
                onClick={this.onClick.bind(this, tag.id)}
              >
                {tag.label}
              </MenuItem>
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default compose(
  graphql(allTags),
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
  })
)(props => {
  if (props.data.loading) return null
  const data = props.data.allTags.edges.map(edge => edge.node)
  return <TagAutocomplete {...props} data={data} />
})