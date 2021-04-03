import React from 'react';
import { URL } from '../../../../../../../shared/constants/constants';

// MaterialUI
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
// CSS
import styles from './copybuildlink.module.css';
// Types
type CopyLinkProps = {
	buildId: string | undefined;
};

const CopyBuildLink = (props: CopyLinkProps) => {
	const { buildId } = props;

	return (
		<Grid container className={styles.copyBuildLinkContainer}>
			<Grid item xs={12}>
				<p className={styles.copyTitle}>Get sharable link</p>
				<p className={styles.copyDescription}>
					Copy and paste the link below into chat rooms or browsers.
				</p>
			</Grid>
			<Grid item xs={12}>
				<Tooltip
					title='Copy to clipboard'
					placement='top'
					arrow
					onClick={() => {
						navigator.clipboard.writeText(`${URL.CLIENT}/build/${buildId}`);
					}}
				>
					<Button
						variant='contained'
						className={styles.copyButton}
						color='secondary'
					>
						<FileCopyIcon className={styles.copyIcon} />
					</Button>
				</Tooltip>
				<input
					type='text'
					value={`${URL.CLIENT}/build/${buildId}`}
					className={styles.copyInput}
				/>
			</Grid>
		</Grid>
	);
};

export default CopyBuildLink;