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
    this.setState({ newTag: event.target.value })
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
      console.log(tag)
      this.setState({ newTag: '' })
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
    console.log(tag)
    this.setState({ newTag: '' })
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
          onChange={this.onUpdateNewTag}
          onKeyUp={this.onKeyUp}
        />
        {this.state.newTag && (
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
