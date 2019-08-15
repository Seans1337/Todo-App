import React from 'react'
import {Table, Checkbox, Button} from 'semantic-ui-react'

export const TodoItem = ({todo, handleDelete, handleToggle}) => {
  return(
  <Table.Row positive={todo.completed}>
    <Table.Cell textAlign={'center'} collapsing={true}>
      <Checkbox
        checked={todo.completed}
        onChange={handleToggle}
      />
    </Table.Cell>
    <Table.Cell>
      {todo.title}
      <Button
        color='red'
        icon='trash'
        floated='right'
        compact size='small'
        onClick={handleDelete}
      />
    </Table.Cell>
  </Table.Row>
)}

export default TodoItem
