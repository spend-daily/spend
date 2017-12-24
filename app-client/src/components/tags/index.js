import React from 'react'
import { compose, graphql } from 'react-apollo'
import { Chip, withStyles } from 'material-ui'

import TagAutocomplete from './autocomplete'
import { deleteTransactionTag, transactionTags } from './queries'

const styles = theme => ({
  tagList: {
    display: 'flex',
    listStyle: 'none',
    padding: '0'
  },
  tag: {
    padding: '4px'
  },
  tagInput: {
    padding: '0 4px',
    margin: '-12px 0 0'
  }
})

class Tags extends React.Component {
  onDeleteTag = tagId => () => {
    this.props.deleteTransactionTag({
      variables: {
        transactionTag: {
          tagId: tagId,
          transactionId: this.props.transactionId
        }
      }
    })
  }

  render() {
    return (
      <ul className={this.props.classes.tagList}>
        {this.props.data.map(tag => (
          <li className={this.props.classes.tag} key={tag.id}>
            <Chip label={tag.label} onDelete={this.onDeleteTag(tag.id)} />
          </li>
        ))}
        <li className={this.props.classes.tagInput}>
          <TagAutocomplete transactionId={this.props.transactionId} />
        </li>
      </ul>
    )
  }
}

export default compose(
  withStyles(styles),
  graphql(transactionTags, {
    options: props => ({
      variables: {
        conditions: {
          transactionId: props.transactionId
        }
      }
    })
  }),
  graphql(deleteTransactionTag, {
    name: 'deleteTransactionTag',
    options: props => ({
      variables: {
        transactionTag: {
          ...props
        }
      }
    })
  })
)(props => {
  if (props.data.loading) return null
  const data = props.data.allTransactionTags.edges.map(edge => edge.node.tag)
  return <Tags {...props} data={data} />
})
