import { useMemo, useState, memo, useCallback } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemButton, ListItemIcon, Checkbox, ListItemText, ToggleButton, ToggleButtonGroup, Box, Button, TextField, } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import './TodoList.scss';

type FilterType = 'all' | 'active' | 'completed';

const TodoList = () => {
	const [todos, setTodos] = useState<string[]>([])
	const [text, setText] = useState<string>('')
	const [checked, setChecked] = useState<number[]>([]);
	const [filter, setFilter] = useState<FilterType>('all');

	const handleToggle = useCallback((value: number) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	}, [checked]);

	const handleAddTodo = useCallback(() => {
		if (text.trim()) {
			setTodos([...todos, text.trim()]);
			setText('');
		}
	}, [text, todos])

	const handleKeyEnter = useCallback((e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleAddTodo();
		}
		e.stopPropagation();
	}, [handleAddTodo])

	const filteredTodos = useMemo(() => {
		return todos.filter((_, index) => {
			const isCompleted = checked.includes(index);
			if (filter === 'active') return !isCompleted;
			if (filter === 'completed') return isCompleted;
			return true;
		});
	}, [todos, checked, filter])

	const handleFilterChange = useCallback((
		event: React.MouseEvent<HTMLElement>,
		newFilter: FilterType,
	) => {
		if (newFilter !== null) {
			setFilter(newFilter);
		}
	}, []);

	const activeTodosCount = useMemo(() => 
		todos.filter((_, index) => !checked.includes(index)).length,
		[todos, checked]
	);

	const handleClearCompleted = useCallback(() => {
    const newTodos = todos.filter((_, index) => !checked.includes(index));
    setTodos(newTodos);
    setChecked([]);
  }, [checked, todos]);

	const renderTodoItem = useCallback((item: string) => {
    const originalIndex = todos.indexOf(item);
    const labelId = `checkbox-list-label-${originalIndex}`;
    const isCompleted = checked.includes(originalIndex);

    return (
      <ListItem key={item} divider>
        <ListItemButton role={undefined} onClick={handleToggle(originalIndex)}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={isCompleted}
              tabIndex={-1}
              disableRipple
							icon={<CircleOutlinedIcon/>}
							checkedIcon={<CheckCircleOutlineIcon/>}
            />
          </ListItemIcon>
          <ListItemText
            id={labelId}
            primary={item}
            sx={{
              textDecoration: isCompleted ? 'line-through' : 'none',
              color: isCompleted ? 'text.secondary' : 'text.primary',
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  }, [todos, checked, handleToggle]);

	return (
		<Box className="todolist__wrapper">
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1-content"
					id="panel1-header"
					sx={{flexDirection: 'row-reverse', gap: 2}}
				>
					<TextField
						type="text"
						placeholder="What needs to be done?"
						fullWidth
						value={text}
						onChange={(e) => setText(e.target.value)}
						onClick={(e) => e.stopPropagation()}
						onKeyDown={handleKeyEnter}
						className='todo-input'
					/>
				</AccordionSummary>
				<AccordionDetails>
					<List>
						{filteredTodos.length !== 0 ? (
							filteredTodos.map(renderTodoItem)
						) : (
							<p>no {filter!== "all" && filter} todos</p>
						)}
					</List>

					<Box className="actions">
						<p>{activeTodosCount} items left</p>

						<ToggleButtonGroup
							value={filter}
							exclusive
							onChange={handleFilterChange}
							size="small"
						>
							<ToggleButton value="all">All</ToggleButton>
							<ToggleButton value="active">Active</ToggleButton>
							<ToggleButton value="completed">Completed</ToggleButton>
						</ToggleButtonGroup>

						<Button onClick={handleClearCompleted}>
							Clear completed
						</Button>
					</Box>

				</AccordionDetails>
			</Accordion>
		</Box>
	)
}

export default memo(TodoList)