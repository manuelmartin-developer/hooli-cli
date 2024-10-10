import React from 'react';
import {Box, Text, useInput, useApp, Newline, Spacer} from 'ink';
import {execa} from 'execa';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import Spinner from 'ink-spinner';
import TextInput from 'ink-text-input';

const Install = () => {
	// Constants
	const baseRegistryUrl = 'https://registry.npmjs.org/';
	const searchUrl = `${baseRegistryUrl}-/v1/search?text=`;

	// Component states
	const [canInstall, setCanInstall] = React.useState<boolean>(false);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [isSearching, setIsSearching] = React.useState<boolean>(false);
	const [loadingText, setLoadingText] = React.useState<string>('Loading...');
	const [packages, setPackages] = React.useState<string[] | undefined>();
	const [pointer, setPointer] = React.useState<number>(0);
	const [query, setQuery] = React.useState<string>('');
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

		if (key.escape) {
			exit();
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

		if (key.return) {
			if (!packages || !canInstall) return;

			if (!selectedPackages.length) {
				const pkg = packages[pointer];

				if (!pkg) return;

				setLoadingText(`Installing ${pkg}...`);
				setIsLoading(true);

				await execa('npm', ['install', pkg], {stdio: 'inherit'});
				exit();
				return;
			}

			setLoadingText(`Installing ${selectedPackages.join(', ')}...`);
			setIsLoading(true);

			await execa('npm', ['install', ...selectedPackages], {stdio: 'inherit'});
			exit();
		}
	});

	// Methods
	const searchPackages = async (query: string) => {
		setIsSearching(true);

		const {stdout} = await execa('curl', [`${searchUrl}${query}`]);
		const data = JSON.parse(stdout);
		const names = data.objects.map((object: any) => object.package.name);

		if (names.length) {
			setPackages(names);
			setCanInstall(true);
			setIsSearching(false);
		} else {
			setPackages(['🚫 No packages found']);
			setCanInstall(false);
			setIsSearching(false);
		}
	};

	// Component Lifecycle
	React.useEffect(() => {
		setIsLoading(false);
	}, []);

	React.useEffect(() => {
		if (!query) return;

		searchPackages(query.trim());
	}, [query]);

	return (
		<>
			<Box flexDirection="column">
				<Gradient name="summer">
					<BigText text=" hooli install" font="tiny" />
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
						<Box flexDirection="row">
							<Text>Search packages </Text>
							{isSearching && <Spinner type="dots12" />}
						</Box>
						<Newline />
						<Box flexDirection="row">
							<Text color="blue">npm install </Text>
							<TextInput
								placeholder="package-name"
								value={query}
								onChange={setQuery}
							/>
						</Box>
						<Newline />
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
										<Text>{isSelected && canInstall ? '👉 ' : '   '}</Text>
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
						to install the selected packages
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

export default Install;
