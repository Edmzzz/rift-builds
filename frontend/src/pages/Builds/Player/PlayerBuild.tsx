import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

// MaterialUI
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// Components
import BuildItem from './components/BuildItem/BuildItem';
import RuneItem from './components/RuneItem/RuneItem';
import SpellItem from './components/Spellitem/SpellItem';
import PlayerBuildHeader from './components/PlayerBuildHeader/PlayerBuildHeader';
import PlayerBuildFooter from './components/PlayerBuildFooter/PlayerBuildFooter';
import SectionDivider from './components/SectionDivider/SectionDivider';
// Types
import { BuildInterface, ItemInterface } from '../../../utils/interfaces';
// CSS
import styles from './playerbuild.module.css';
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		overflow: 'hidden',
	},
	large: {
		width: theme.spacing(7),
		height: theme.spacing(7),
	},
}));

// === CHANGE PROPS TYPE === //
const PlayerBuild = (props: any) => {
	const classes = useStyles();

	const { match } = props;
	const [build, setBuild] = useState<BuildInterface>();

	useEffect(() => {
		axios
			.get(
				// `https://wildriftbuilds.herokuapp.com/api/build/${match.params.buildId}`
				`/api/build/${match.params.buildId}`
			)
			.then((res) => {
				const { data } = res;
				setBuild(data);
			});
	}, []);

	return (
		<div className={classes.root}>
			{build ? (
				<Box
					style={{
						backgroundColor: '#303841',
						padding: '30px',
						color: '#ffffff',
						margin: '50px 0',
					}}
				>
					<PlayerBuildHeader build={build} />

					{/* PRIMARY ITEMS */}
					<SectionDivider title='Primary Items' />
					<Grid container spacing={3}>
						<Grid item xs={12}>
							{build.itemsConfirmed
								.filter((item: ItemInterface) => item.type !== 'optional')
								.map((item: ItemInterface, index) => {
									const { id: itemId, itemName, reason } = item;

									return (
										<BuildItem
											key={index}
											itemId={itemId}
											itemName={itemName}
											reason={reason ? reason : ''}
										/>
									);
								})}
						</Grid>
					</Grid>

					{/* OPTIONAL ITEMS */}
					<SectionDivider title='Optional Items' />
					<Grid container spacing={3}>
						<Grid item xs={12}>
							{build.itemsConfirmed
								.filter((item: ItemInterface) => item.type !== 'primary')
								.map((item: ItemInterface, index) => {
									const { id: itemId, itemName, reason } = item;

									return (
										<BuildItem
											key={index}
											itemId={itemId}
											itemName={itemName}
											reason={reason ? reason : ''}
										/>
									);
								})}
						</Grid>
					</Grid>

					{/* RUNES */}
					<SectionDivider title='Runes' />
					<Grid container spacing={3}>
						<Grid item xs={12}>
							{/* KEYSTONE RUNE */}
							<RuneItem
								runeId={build.runes.keystone.id}
								runeName={build.runes.keystone.runeName}
								reason={
									build.runes.keystone.reason ? build.runes.keystone.reason : ''
								}
							/>

							{/* DOMINATION RUNE */}
							<RuneItem
								runeId={build.runes.domination.id}
								runeName={build.runes.domination.runeName}
								reason={
									build.runes.domination.reason
										? build.runes.domination.reason
										: ''
								}
							/>

							{/* RESOLVE RUNE */}
							<RuneItem
								runeId={build.runes.resolve.id}
								runeName={build.runes.resolve.runeName}
								reason={
									build.runes.resolve.reason ? build.runes.resolve.reason : ''
								}
							/>

							{/* INSPIRATION RUNE BOX */}
							<RuneItem
								runeId={build.runes.inspiration.id}
								runeName={build.runes.inspiration.runeName}
								reason={
									build.runes.inspiration.reason
										? build.runes.inspiration.reason
										: ''
								}
							/>
						</Grid>
					</Grid>

					{/* SPELLS */}
					<SectionDivider title='Summoner Spells' />
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Box p={1}>
								<SpellItem
									spellId={build.spells.spellOne.id}
									spellName={build.spells.spellOne.spellName}
								/>
								<SpellItem
									spellId={build.spells.spellTwo.id}
									spellName={build.spells.spellTwo.spellName}
								/>
							</Box>
						</Grid>
					</Grid>

					{/* FOOTER*/}
					<PlayerBuildFooter dateSubmitted={build.dateSubmitted} />
				</Box>
			) : (
				<CircularProgress />
			)}
		</div>
	);
};

export default withRouter(PlayerBuild);
