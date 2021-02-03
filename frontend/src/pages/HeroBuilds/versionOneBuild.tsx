import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LazyLoadImage } from 'react-lazy-load-image-component';

// MaterialUI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';

interface ItemInterface {
	id: string;
	itemName: string;
	reason?: string;
	type: string;
	url: string;
}

interface ChampionInterface {
	id: string;
	championName: string;
	url: string;
}

interface RankInterface {
	id: string;
	rankName: string;
	url: string;
}

interface BuildInterface {
	id: string;
	username: string;
	champion: ChampionInterface;
	items: ItemInterface[];
	rank: RankInterface;
}

// https://flaviocopes.com/typescript-object-destructuring/
let page = 5;

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		overflow: 'hidden',
	},
	paper: {
		width: '100%',
		margin: `${theme.spacing(1)}px auto`,
		padding: theme.spacing(2),
		backgroundColor: '#233248',
		color: '#ffffff',
	},
	large: {
		width: theme.spacing(7),
		height: theme.spacing(7),
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
}));

export default function Builds() {
	const [loading, setLoading] = useState(true);
	const [builds, setBuilds] = useState<Array<BuildInterface>>([]);
	const [champions, setChampions] = useState<Array<ChampionInterface>>([]);
	const [championFilter, setChampionFilter] = useState<ChampionInterface>({
		id: '',
		championName: '',
		url: '',
	});

	const classes = useStyles();

	useEffect(() => {
		const getChampions = axios.get(
			'https://wildriftbuilds.herokuapp.com/api/champion/all'
		);
		const getBuilds = axios.post(
			'https://wildriftbuilds.herokuapp.com/api/build/all',
			{
				page,
			}
		);

		Promise.all([getChampions, getBuilds]).then((values) => {
			const [{ data: championsArray }, { data: buildsArray }] = values;

			// Sort Champions
			championsArray.sort(function (
				a: ChampionInterface,
				b: ChampionInterface
			) {
				if (a.championName < b.championName) {
					return -1;
				}
				if (a.championName > b.championName) {
					return 1;
				}
				return 0;
			});
			setChampions(championsArray);

			setBuilds((prev: BuildInterface[]) => [...prev, ...buildsArray]);
		});
	}, []);

	// Get all builds
	useEffect(() => {
		console.log(championFilter);
	}, [championFilter]);

	const getMoreBuilds = async () => {
		console.log(championFilter.id);

		if (championFilter.id === '') {
			page += 5;

			const getBuilds = await axios.post(
				'https://wildriftbuilds.herokuapp.com/api/build/all',
				{
					page,
				}
			);
			const { data } = getBuilds;

			setBuilds((prev: BuildInterface[]) => [...prev, ...data]);
		} else {
			page += 5;

			const getBuildsForHero = await axios.post(
				`https://wildriftbuilds.herokuapp.com/api/build/all/${
					championFilter ? championFilter.id : ''
				}`,
				{
					page,
				}
			);
			const { data } = getBuildsForHero;

			setBuilds((prev: BuildInterface[]) => [...prev, ...data]);
		}
	};

	const handleChampSelectChange = async (e: any) => {
		page = 5;

		const getChampion = champions.find(
			(champ: ChampionInterface) => champ.id === e.target.value
		);

		if (!getChampion) {
			// CHAMPION NOT FOUND
			setChampionFilter({
				id: '',
				championName: '',
				url: '',
			});

			const getBuilds = await axios.post(
				`https://wildriftbuilds.herokuapp.com/api/build/all/`,
				{
					page,
				}
			);
			const { data } = getBuilds;

			setBuilds((prev: BuildInterface[]) => [...data]);
		} else {
			// CHAMPION FOUND
			setChampionFilter(getChampion);

			const getBuildsForHero = await axios.post(
				`https://wildriftbuilds.herokuapp.com/api/build/all/${
					getChampion ? getChampion.id : ''
				}`,
				{
					page,
				}
			);
			const { data } = getBuildsForHero;

			setBuilds((prev: BuildInterface[]) => [...data]);
		}
	};

	return (
		<>
			<hr />
			<Typography>Filter by:</Typography>
			<FormControl className={classes.formControl}>
				<InputLabel shrink htmlFor='champion-select'>
					Champion
				</InputLabel>
				<NativeSelect
					onChange={handleChampSelectChange}
					inputProps={{
						name: 'champion',
						id: 'champion-select',
					}}
				>
					<option value=''>None</option>
					{champions.map(
						({ id, championName, url }: ChampionInterface, index) => {
							return <option value={id}>{championName}</option>;
						}
					)}
				</NativeSelect>
				<FormHelperText>Select a champion</FormHelperText>
			</FormControl>

			{builds.length === 0 ? (
				<Box>
					<CircularProgress />
				</Box>
			) : (
				<InfiniteScroll
					dataLength={builds.length}
					next={getMoreBuilds}
					hasMore={true}
					loader={<h4>Loading...</h4>}
				>
					{builds.map((build, index) => {
						const {
							id: buildId,
							username,
							items,
							champion,
							rank,
						}: BuildInterface = build;
						const { id: championId, championName, url } = champion;

						return (
							<div className={classes.root}>
								<Paper className={classes.paper}>
									<Grid container wrap='nowrap' spacing={2}>
										<Grid item>
											<Avatar className={classes.large}>
												<LazyLoadImage
													src={`/images/wildriftchampions/${championId}.png`}
													style={{ width: '100%' }}
													title={championName}
													alt={championName}
												/>
											</Avatar>
										</Grid>
										<Grid item xs>
											<Box display='flex'>
												<Box flexGrow={1}>
													<Typography variant='body1'>
														<span
															style={{
																color: '#517ebd',
																fontWeight: 'bold',
																fontSize: '20px',
															}}
														>
															{championName}
														</span>
													</Typography>
													<Typography variant='body1'>
														<span style={{ color: '#949494' }}>by</span>{' '}
														<span style={{ color: '#e9eaec' }}>{username}</span>
													</Typography>
												</Box>
												<Box>
													<Avatar
														className={classes.large}
														style={{ backgroundColor: '#38465a' }}
													>
														{rank ? (
															<LazyLoadImage
																src={`/images/wildriftranks/${rank.id}.png`}
																style={{
																	width: '80%',
																}}
																title={rank.rankName}
																alt={rank.rankName}
															/>
														) : (
															<LazyLoadImage
																src='/images/wildriftranks/a4938a79-f11f-4ee1-9ec5-7741a12c4ef9.png'
																style={{
																	width: '80%',
																}}
																title='Unranked'
																alt='Unranked'
															/>
														)}
													</Avatar>
												</Box>
											</Box>
										</Grid>
									</Grid>
									<Box style={{ marginTop: '30px' }}>
										{items
											.filter((item) => item.type !== 'optional')
											.map((item) => {
												const { id: itemId, itemName } = item;

												return (
													<>
														<Box style={{ display: 'inline-block' }}>
															<LazyLoadImage
																src={`/images/wildriftitems/${itemId}.png`}
																style={{ width: '50px' }}
																alt={itemName}
																title={itemName}
															/>
														</Box>
													</>
												);
											})}
									</Box>
									<Box
										display='flex'
										flexDirection='row-reverse'
										style={{ margin: '20px 0 0 0' }}
									>
										<a
											// href={`https://wildriftbuilds.herokuapp.com/build/${buildId}`}
											href={`/build/${buildId}`}
										>
											<Button variant='contained' color='primary'>
												Learn more
											</Button>
										</a>
									</Box>
								</Paper>
							</div>
						);
					})}
				</InfiniteScroll>
			)}
		</>
	);
}