import React from 'react';
import {Box, Text, useInput, useApp, Newline} from 'ink';
import {execa} from 'execa';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import Spinner from 'ink-spinner';
import {IScript} from '../models/interfaces.js';

const Scripts = () => {
	// Component states
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [scripts, setScripts] = React.useState<IScript[] | undefined>();
	const [pointer, setPointer] = React.useState<number>(0);

	// Hooks
	const {exit} = useApp();

	useInput(async (_, key) => {
		if (key.upArrow) {
			setPointer(prev => (prev <= 0 ? 0 : prev - 1));
		}

		if (key.downArrow) {
			if (!scripts) return;

			setPointer(prev =>
				prev >= scripts.length - 1 ? scripts.length - 1 : prev + 1,
			);
		}

		if (key.escape) {
			exit();
		}

		if (key.return) {
			if (!scripts) return;

			const script = scripts[pointer];

			if (!script) return;

			await execa('npm', ['run', script.name], {stdio: 'inherit'});
			exit();
		}
	});

	// Methods
	const getScripts = async () => {
		const {stdout} = await execa('cat', ['package.json']);
		const packageJson = JSON.parse(stdout);
		const names = Object.keys(packageJson.scripts || {});
		const commands = Object.values(packageJson.scripts || {});
		const scripts = names.map((name, index) => {
			return {name, command: commands[index]};
		}) as IScript[];

		if (scripts.length) {
			setScripts(scripts);
		} else {
			exit();
		}
	};

	// Component Lifecycle
	React.useEffect(() => {
		execa('ls', ['-a']).then(result => {
			if (!result.stdout.includes('package.json')) {
				setIsLoading(false);
				exit();
			} else {
				setIsLoading(false);
				getScripts();
			}
		});
	}, []);

	return (
		<>
			<Box flexDirection="column">
				<Gradient name="summer">
					<BigText text="hooli scripts" font="tiny" />
				</Gradient>
				{isLoading && (
					<Text>
						<Spinner type="dots12" />
						{' Loading...'}
					</Text>
				)}
				{!isLoading && (
					<>
						<Newline count={2} />
						{!scripts && (
							<>
								<Text>🚫 No scripts found in package.json</Text>
								<Newline />
							</>
						)}
						{scripts && (
							<>
								<Newline count={1} />
								{scripts.map((script, index) => {
									const isSelected = pointer === index;
									return (
										<Box key={script.name} flexDirection="row">
											<Text>{isSelected ? '👉 ' : '   '}</Text>
											<Text color={isSelected ? 'green' : undefined}>
												{script.name}
											</Text>
											<Text color="white" dimColor>
												{' '}
												{script.command}
											</Text>
										</Box>
									);
								})}
								<Newline />
							</>
						)}
					</>
				)}
			</Box>
			<Newline count={2} />
			<Box flexDirection="column">
				<Text color="grey">
					Press{' '}
					<Text bold color="blue">
						Enter
					</Text>{' '}
					to run script
				</Text>
				<Text color="grey">
					Press{' '}
					<Text bold color="blue">
						Esc
					</Text>{' '}
					to exit
				</Text>
			</Box>
		</>
	);
};

export default Scripts;
