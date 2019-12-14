import moment from 'moment';
import user from '../user';

const filters = {
	state: {
		dateFilterSelected: {
			dateLabel: 'Last 2 Days',
			nbDays: 1
		},
		dateFilters: [
			{ dateLabel: 'Today', nbDays: 0 },
			{ dateLabel: 'Last 2 Days', nbDays: 1 },
			{ dateLabel: 'Last 7 Days', nbDays: 7 },
			{ dateLabel: 'Last 30 Days', nbDays: 31 },
			{ dateLabel: 'Last 90 Days', nbDays: 90 }
		],
		envFilterSelected: {
			envLabel: 'All Env.',
			envId: 'ALL'
		},
		envFilters: [
			{ envLabel: 'All Env.', envId: 'ALL' },
			{ envLabel: 'Production', envId: 'PROD' },
			{ envLabel: 'Pre-Production', envId: 'PREPROD' },
			{ envLabel: 'Staging', envId: 'STAGING' },
			{ envLabel: 'Development', envId: 'DEV' }
		],
		runStatusFilterSelected: {
			runStatusLabel: 'All Status',
			runStatusId: 'ALL'
		},
		runStatusFilters: [
			{ runStatusLabel: 'All Status', runStatusId: 'ALL' },
			{ runStatusLabel: 'Success', runStatusId: 'SUCCESS' },
			{ runStatusLabel: 'Failed', runStatusId: 'FAILED' },
			{ runStatusLabel: 'Running', runStatusId: 'RUNNING' }
		],
		minDateFilter: moment()
			.utc()
			.startOf('day')
			.subtract(1, 'days')
			.toISOString(),
		accountFilterSelected: { account_name: 'All Accounts', id: '000000' },
		filteredAccounts: []
	},
	mutations: {
		updateDateFilterSelected(state, dateFilterSelected) {
			state.dateFilterSelected = dateFilterSelected;
		},
		updateEnvFilterSelected(state, envFilterSelected) {
			state.envFilterSelected = envFilterSelected;
		},
		updateRunStatusFilterSelected(state, runStatusFilterSelected) {
			state.runStatusFilterSelected = runStatusFilterSelected;
		},
		updateMinDateFilter(state, dateFilterSelected) {
			state.minDateFilter = moment()
				.utc()
				.startOf('day')
				.subtract(dateFilterSelected.nbDays, 'days')
				.toISOString();
		},
		updateAccountFilterSelected(state, accounts) {
			state.filteredAccounts = accounts;
		}
	},
	actions: {
		applyDateFilterSelected({ commit }, dateFilterSelected) {
			//Propagate the DateFilterSelected to the store
			commit('updateDateFilterSelected', dateFilterSelected);
			//Compute the minDate to apply from the DateFilterSelected
			commit('updateMinDateFilter', dateFilterSelected);
		},
		updateFilteredAccounts({ commit }, accountFilterSelected) {
			commit('updateAccountFilterSelected', accountFilterSelected);
		},
		applyEnvFilterSelected({ commit }, envFilterSelected) {
			commit('updateEnvFilterSelected', envFilterSelected);
		},
		applyRunStatusFilterSelected({ commit }, runStatusFilterSelected) {
			commit('updateRunStatusFilterSelected', runStatusFilterSelected);
		}
	},
	getters: {
		periodFiltered(state) {
			//Compute the date array from minDateFilter to Now to build chart
			let periodFiltered = [];
			var i;
			for (i = 0; i <= state.dateFilterSelected.nbDays; i++) {
				periodFiltered.push(
					moment()
						.utc()
						.startOf('day')
						.subtract(state.dateFilterSelected.nbDays - i, 'days')
						.toISOString()
				);
			}
			return periodFiltered;
		},
		whereRunsFilter(state) {
			let whereRunsFilter = [];

			const { filteredAccounts, minDateFilter, envFilterSelected, runStatusFilterSelected } = state;

			if (minDateFilter !== undefined) {
				whereRunsFilter.push(['dag_execution_date', '>=', minDateFilter]);
			} else {
				whereRunsFilter.push(['dag_execution_date', '>=', '2019-01-01T00:00:00.000Z']);
			}

			if (filteredAccounts.length > 0) {
				whereRunsFilter.push(['account', 'in', filteredAccounts]);
			} else {
				whereRunsFilter.push(['account', 'in', user.state.user.accounts]);
			}

			if (envFilterSelected.envId !== 'ALL') {
				whereRunsFilter.push(['environment', '==', envFilterSelected.envId]);
			}

			if (runStatusFilterSelected.runStatusId !== 'ALL') {
				whereRunsFilter.push(['status', '==', runStatusFilterSelected.runStatusId]);
			}

			return whereRunsFilter;
		},
		whereConfFilter(state) {
			let whereConfFilter = [];
			const { filteredAccounts, envFilterSelected } = state;

			if (filteredAccounts.length > 0) {
				whereConfFilter.push(['account', 'in', filteredAccounts]);
			} else {
				whereConfFilter.push(['account', 'in', user.state.user.accounts]);
			}

			if (envFilterSelected.envId !== 'ALL') whereConfFilter.push(['environment', '==', state.envFilterSelected.envId]);

			return whereConfFilter;
		}
	}
};

export default filters;
