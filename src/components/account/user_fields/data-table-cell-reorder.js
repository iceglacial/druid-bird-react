const React = require('react');
const ReactDataGrid = require('react-data-grid');
const {
  DraggableHeader: { DraggableContainer }
} = require('react-data-grid-addons');

class Example extends React.Component {
  createRows = () => {
    let rows = [];
    for (let i = 1; i < 1000; i++) {
      rows.push({
        id: i,
        title: 'Title ' + i,
        count: i * 1000
      });
    }

    return rows;
  };

  rowGetter = (i) => {
    return this.state.rows[i];
  };

  onHeaderDrop = (source, target) => {
    const stateCopy = Object.assign({}, this.state);
    const columnSourceIndex = this.state.columns.findIndex(
      i => i.key === source
    );
    const columnTargetIndex = this.state.columns.findIndex(
      i => i.key === target
    );

    stateCopy.columns.splice(
      columnTargetIndex,
      0,
      stateCopy.columns.splice(columnSourceIndex, 1)[0]
    );

    const emptyColumns = Object.assign({},this.state, { columns: [] });
    this.setState(
      emptyColumns
    );

    const reorderedColumns = Object.assign({},this.state, { columns: stateCopy.columns });
    this.setState(
      reorderedColumns
    );
  };

  state = {
    columns: [
      {
        key: 'id',
        name: 'ID',
        width: 50,
        draggable: true
      },
      {
        key: 'title',
        name: 'Title',
        width: 100,
        draggable: true,
        resizable: true
      },
      {
        key: 'time',
        name: 'Time',
        width: 100,
        draggable: false,
        resizable: true
      },
      {
        key: 'note',
        name: 'Note',
        width: 100,
        draggable: true,
        resizable: true
      },
      {
        key: 'setting',
        name: 'Setting',
        width: 90,
        draggable: true,
      },
    ],
    rows: this.createRows()
  };

  render() {
    return (
      <DraggableContainer
        onHeaderDrop={this.onHeaderDrop}>
        <ReactDataGrid
          columns={this.state.columns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={500}
        />
      </DraggableContainer>
    );
  }
}

module.exports = Example