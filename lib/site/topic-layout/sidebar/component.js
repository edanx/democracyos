import React, {Component} from 'react'
import Filter from './filter/component'
import List from './list/component'
import sorts from './sorts'

export default class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topics: null,
      topicsDisplay: null,
      filterOpenCount: 0,
      filterClosedCount: 0,
      filterOpenCloseToggle: true,
      filterHideVoted: false,
      filterCurrentSort: 'closing-soon'
    }
    this.filterStatusChange = this.filterStatusChange.bind(this)
    this.filterHideVotedChange = this.filterHideVotedChange.bind(this)
    this.filterSortChange = this.filterSortChange.bind(this)
    this.filterTopics = this.filterTopics.bind(this)
  }

  componentWillReceiveProps (props) {
    if (!props.topics) return
    this.setState({
      topics: props.topics,
      filterOpenCount: props.topics.filter((topic) => !topic.closed).length,
      filterClosedCount: props.topics.filter((topic) => topic.closed).length
    }, this.filterTopics)
  }

  filterStatusChange (e) {
    let status = e.currentTarget.getAttribute('data-status') === 'open'
    this.setState({filterOpenCloseToggle: status}, this.filterTopics)
  }

  filterHideVotedChange (e) {
    let hide = e.currentTarget.checked
    this.setState({filterHideVoted: hide}, this.filterTopics)
  }

  filterSortChange (e) {
    let sort = e.currentTarget.getAttribute('data-sort')
    this.setState({filterCurrentSort: sort}, this.filterTopics)
  }

  filterTopics () {
    let topics = this.state.topics
    if (!topics) return
    this.setState({
      topicsDisplay: topics
        // Status
        .filter((topic) => this.state.filterOpenCloseToggle ? !topic.closed : topic.closed)
        // Hide Voted
        .filter((topic) => this.state.filterHideVoted ? topic.voted : true)
        // Sort
        .sort(sorts[this.state.filterCurrentSort].sort)
    })
  }

  render () {
    return (
      <nav id='sidebar'>
        <Filter
          sorts={sorts}

          openCount={this.state.filterOpenCount}
          closedCount={this.state.filterClosedCount}
          openCloseToggle={this.state.filterOpenCloseToggle}
          hideVoted={this.state.filterHideVoted}
          currentSort={this.state.filterCurrentSort}

          filterStatusChange={this.filterStatusChange}
          filterSortChange={this.filterSortChange}
          filterHideVotedChange={this.filterHideVotedChange} />
        <List topics={this.state.topicsDisplay} />
      </nav>
    )
  }
}