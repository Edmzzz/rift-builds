import axios from 'axios';

// Shared
import { BuildValidationHelper } from '../utils/buildValidationHelpers';
import { URL } from '../config/config';
import { BuildInterface } from '../interfaces/Build';

// Returns 5 builds every time
export const getBuildsForChampion = (
	championName: string,
	pageNumber: number
) =>
	axios.post(`${URL.SERVER}/api/build/all/${championName}`, {
		page: pageNumber,
	});

export const saveBuild = (
	completeBuild: BuildInterface,
	recaptchaToken: string
) => {
	return axios.post(`${URL.SERVER}/api/build/save`, {
		build: {
			...BuildValidationHelper.sanitizeBuildTextInputs(completeBuild),
			dateSubmitted: new Date(),
		},
		recaptchaToken,
	});
};
