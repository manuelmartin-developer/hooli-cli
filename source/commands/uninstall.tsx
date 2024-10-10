import React from 'react';
import {Box, Text, useInput, useApp, Newline, Spacer} from 'ink';
import {execa} from 'execa';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import Spinner from 'ink-spinner';

const Uninstall = () => {
	// Component states
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [loadingText, setLoadingText] = React.useState<string>(
		'Loading packages...',
	);
	const [dependencies, setDependencies] = React.useState<
		string[] | undefined
	>();
	const [devDependencies, setDevDependencies] = React.useState<
		string[] | undefined
	>();
	const [packages, setPackages] = React.useState<string[] | undefined>();
	const [pointer, setPointer] = React.useState<number>(0);
	const [selectedPackages, setSelectedPackages] = React.useState<string[]>([]);

	// Hooks
	const {exit} = useApp();

	useInput(async (_, key) => {
		if (key.upArrow) {
			setPointer(prev => (prev <= 0 ? 0 : prev - 1));
		}

		if (key.downArrow) {
			if (!packages) return;

			setPointer(prev =>
				prev >= packages.length - 1 ? packages.length - 1 : prev + 1,
			);
		}

		if (key.rightArrow) {
			if (!packages) return;

			const pkg = packages[pointer];

			if (pkg && selectedPackages.includes(pkg)) {
				setSelectedPackages(prev => prev.filter(p => p !== pkg));
			} else if (pkg && !selectedPackages.includes(pkg)) {
				setSelectedPackages(prev => [...prev, pkg]);
			}
		}

		if (key.escape) {
			exit();
		}

		if (key.return) {
			if (!packages) return;

			if (!selectedPackages.length) {
				const pkg = packages[pointer];

				if (!pkg) return;

				setLoadingText(`Uninstalling ${pkg}...`);
				setIsLoading(true);

				await execa('npm', ['uninstall', pkg], {
					stdio: 'inherit',
				});
				exit();
				return;
			}

			setLoadingText(`Uninstalling selected packages...`);
			setIsLoading(true);

			await execa('npm', ['uninstall', ...selectedPackages], {
				stdio: 'inherit',
			});
			exit();
		}
	});

	// Methods
	const getPackages = async () => {
		const {stdout} = await execa('cat', ['package.json']);
		const packageJson = JSON.parse(stdout);
		const dependencies = Object.keys(packageJson.dependencies || {});
		const devDependencies = Object.keys(packageJson.devDependencies || {});

		if (!dependencies.length && !devDependencies.length) {
			console.log('🚫 No packages found');
			exit();
			return;
		}

		dependencies.length && setDependencies(dependencies);
		devDependencies.length && setDevDependencies(devDependencies);
		const allPackages = [...dependencies, ...devDependencies];
		const sortedPackages = allPackages.sort((a, b) => a.localeCompare(b));
		setPackages(sortedPackages);
	};

	// Component Lifecycle
	React.useEffect(() => {
		execa('ls', ['-a']).then(result => {
			if (!result.stdout.includes('package.json')) {
				setIsLoading(false);
				exit();
			} else {
				setIsLoading(false);
				getPackages();
			}
		});
	}, []);

	return (
		<>
			<Box flexDirection="column">
				<Gradient name="summer">
					<BigText text=" hooli uninstall" font="tiny" />
				</Gradient>
				<Spacer />
				{isLoading ? (
					<Box>
						<Spinner type="dots12" />
						<Text>{loadingText}</Text>
					</Box>
				) : (
					<>
						<Newline count={2} />
						<Box flexDirection="column" flexWrap="wrap" height={8}>
							{packages?.map((pkg, index) => {
								const isSelected = pointer === index;
								return (
									<Box
										key={pkg}
										flexDirection="row"
										paddingLeft={1}
										justifyContent="flex-start"
									>
										<Text>{isSelected ? '👉 ' : '   '}</Text>
										<Text
											color={
												selectedPackages.includes(pkg)
													? 'yellow'
													: isSelected
													? 'green'
													: undefined
											}
										>
											{pkg}
										</Text>
										{devDependencies?.includes(pkg) && (
											<Text color="grey"> (dev)</Text>
										)}
										{dependencies?.includes(pkg) && <Text color="grey"></Text>}
									</Box>
								);
							})}
						</Box>
					</>
				)}
			</Box>
			<Newline count={2} />
			{!isLoading && (
				<Box flexDirection="column">
					<Text color="grey">
						Press{' '}
						<Text bold color="blue">
							Enter
						</Text>{' '}
						to uninstall the selected packages
					</Text>
					<Text color="grey">
						Press{' '}
						<Text bold color="blue">
							Right Arrow
						</Text>{' '}
						to select or deselect a package
					</Text>
					<Text color="grey">
						Press{' '}
						<Text bold color="blue">
							Esc
						</Text>{' '}
						to exit
					</Text>
				</Box>
			)}
		</>
	);
};

export default Uninstall;
