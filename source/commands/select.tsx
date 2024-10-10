import React from 'react';
import {Box, Text, useInput, useApp, Spacer, Newline} from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import {ESelect} from '../models/enums.js';
import Spinner from 'ink-spinner';
import Scripts from './scripts.js';
import Uninstall from './uninstall.js';
import Install from './install.js';

const Select: React.FC<{command: string | undefined}> = ({command}) => {
	// Constants
	const options = [...Object.values(ESelect)];

	// Component states
	const [pointer, setPointer] = React.useState<number>(0);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [selected, setSelected] = React.useState<string>(command || 'SELECT');

	// Hooks
	const {exit} = useApp();

	useInput(async (_, key) => {
		if (key.upArrow) {
			setPointer(prev => (prev <= 0 ? 0 : prev - 1));
		}

		if (key.downArrow) {
			setPointer(prev =>
				prev >= options.length - 1 ? options.length - 1 : prev + 1,
			);
		}

		if (key.escape) {
			exit();
		}

		if (key.return) {
			const option = options[pointer];

			if (!option) return;

			if (option === ESelect.EXIT) {
				exit();
				return;
			}

			setSelected(option);
		}
	});

	// Component Lifecycle
	React.useEffect(() => {
		if (!command || !options.includes(command.toUpperCase() as ESelect)) {
			setSelected('SELECT');
		}

		setIsLoading(false);
	}, []);

	return (
		<>
			{selected.toUpperCase() === ESelect.INSTALL && <Install />}
			{selected.toUpperCase() === ESelect.SCRIPTS && <Scripts />}
			{selected.toUpperCase() === ESelect.UNINSTALL && <Uninstall />}
			{selected === 'SELECT' && (
				<Box flexDirection="column">
					<Gradient name="summer">
						<BigText text="hooli cli" font="tiny" />
					</Gradient>
					<Spacer />
					{isLoading && (
						<Box>
							<Spinner type="dots12" />
							<Text>Loading...</Text>
						</Box>
					)}
					{!isLoading && (
						<>
							<Text>Select an option:</Text>
							<Newline />
							<Spacer />
							{options.map((option, index) => {
								const isSelected = pointer === index;
								return (
									<Box
										key={option}
										flexDirection="row"
										marginTop={option === ESelect.EXIT ? 1 : 0}
									>
										<Text>{isSelected ? '👉 ' : '   '}</Text>
										<Text color={isSelected ? 'green' : undefined}>
											{option.charAt(0).toUpperCase() +
												option.slice(1).toLowerCase()}
										</Text>
									</Box>
								);
							})}
						</>
					)}
				</Box>
			)}
		</>
	);
};

export default Select;
