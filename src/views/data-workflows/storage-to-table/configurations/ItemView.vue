<template>
	<div>
		<data-management-header :workflowName="workflowName" :tabsItems="tabsItems" />
		<item-component :tabs-items="itemTabsItems" :is-loading="isLoading" :is-not-found="isNotFound" />
	</div>
</template>

<script>
import HeaderInfosMixin from '../header-infos';
import ItemMixin from '@/mixins/data-workflows/item-mixin';

import { mapState } from 'vuex';
import store from '@/store';

export default {
	name: 'storage-to-table-configurations-item-view',
	mixins: [HeaderInfosMixin, ItemMixin],
	data() {
		return {
			moduleName: 'mirrorExcGcsToGbqConfs'
		};
	},
	methods: {
		// Override of `getItem` method in ItemMixin to fetch item with custom firestore path
		async getItem() {
			await store.dispatch('storageToTableConf/closeDBChannel', { clearModule: true });
			await store.dispatch('storageToTableConf/fetchAndAdd', {
				sourceId: this.bucketIn,
				itemId: this.itemId
			});

			this.item = this.storageToTableConf;
			this.isLoading = false;
		}
	},
	computed: {
		...mapState({
			storageToTableConf: state => state.storageToTableConf.data
		}),
		itemId() {
			return this.$route.params.id;
		},
		bucketIn() {
			return this.$route.params.bucketId;
		},
		itemTabsItems() {
			if (!this.item) return [];

			return [
				{
					label: 'Configuration',
					href: 'configuration',
					component: {
						name: 'overview-component',
						props: {
							data: this.configurationData
						}
					}
				},
				{
					label: 'Schema',
					href: 'schema',
					component: {
						name: 'table-schema-view',
						props: {
							schemaRows: this.item.schema
						}
					}
				},
				{
					label: 'Full Json',
					href: 'full-json',
					component: {
						name: 'view-json',
						props: {
							json: this.item,
							jsonId: this.itemId
						}
					}
				},
				{
					label: 'Conversation',
					href: 'conversation',
					component: {
						name: 'view-conversation',
						props: {}
					}
				}
			];
		},
		configurationData() {
			return [
				{
					component: 'view-header',
					props: {
						item: this.item,
						collection: this.moduleName,
						activeHeader: true,
						viewId: this.item.table_name,
						viewType: 'conf',
						description: this.item.table_description
							? this.item.table_description
							: '⚠ Please, add a table description in the configuration file'
					}
				},
				{
					component: 'parameters-list',
					props: {
						groupTitle: 'Context',
						tooltip: true,
						description: 'Context of the Storage to Table configuration',
						paramItems: [
							{
								id: 'account',
								label: 'Account',
								value: this.item.account
							},
							{
								id: 'environment',
								label: 'Environment',
								value: this.item.environment
							},
							{
								id: 'filetemplate',
								label: 'File Name Template',
								value: this.item.id
							}
						]
					}
				},
				{
					component: 'parameters-table',
					props: {
						tableTitle: 'Source Storage',
						description: 'Source Storage of the file to load',
						columns: [
							{
								label: 'Type',
								field: 'source_type',
								width: '100px'
							},
							{
								label: 'Storage ID',
								field: 'source_storage_id',
								width: '200px'
							},
							{
								label: 'Source Folder',
								field: 'source_input_folder',
								width: '200px'
							},
							{
								label: 'Archive Folder',
								field: 'source_archive_folder',
								width: '200px'
							}
						],
						rows: [
							{
								source_type: 'GCS',
								source_storage_id: this.item.source_bucket,
								source_input_folder: this.item.gcs_prefix,
								source_archive_folder: this.item.archive_prefix
							}
						],
						lineNumbers: false,
						searchOptionsEnabled: false
					}
				},
				{
					component: 'parameters-table',
					props: {
						tableTitle: 'Destination Table',
						description: 'The destination table for the file to load',
						columns: [
							{
								label: 'GCP Project',
								field: 'gcp_project',
								width: '150px'
							},
							{
								label: 'Dataset',
								field: 'gbq_dataset',
								width: '150px'
							},
							{
								label: 'Destination Table',
								field: 'table_name',
								width: '200px'
							}
						],
						rows: [
							{
								gcp_project: this.item.gcp_project,
								gbq_dataset: this.item.gbq_dataset,
								table_name: this.item.table_name
							}
						],
						lineNumbers: false,
						searchOptionsEnabled: false
					}
				},
				{
					component: 'parameters-list',
					props: {
						groupTitle: 'Parameters',
						tooltip: true,
						description: 'Main Storage to Table parameters',
						paramItems: [
							{
								id: 'create_disposition',
								label: 'Create Disposition',
								value: this.item.create_disposition
							},
							{
								id: 'field_delimiter',
								label: 'Field Delimiter',
								value: this.item.field_delimiter
							},
							{
								id: 'skip_leading_rows',
								label: 'Skip Leading Rows',
								value: this.item.skip_leading_rows
							},
							{
								id: 'source_format',
								label: 'Source Format',
								value: this.item.source_format
							},
							{
								id: 'write_disposition',
								label: 'Write Disposition',
								value: this.item.write_disposition
							}
						]
					}
				},
				{
					component: 'parameters-list',
					props: {
						groupTitle: 'Options',
						tooltip: true,
						description: 'Storage to Table optional configurations',
						paramItems: [
							{
								id: 'bq_load_job_ignore_unknown_values',
								label: 'Ignore extra values',
								value: this.item.bq_load_job_ignore_unknown_values,
								default: 'false',
								description: 'Ignore extra values not represented in the table schema.'
							},
							{
								id: 'bq_load_job_max_bad_records',
								label: 'Max bad records',
								value: this.item.bq_load_job_max_bad_records,
								default: '0',
								description: 'Number of invalid rows to ignore.'
							},
							{
								id: 'bq_load_job_quote_character',
								label: 'Quote Character',
								value: this.item.bq_load_job_quote_character,
								default: `"`
							},
							{
								id: 'bq_load_job_schema_update_options',
								label: 'Schema Update Options',
								value: this.item.bq_load_job_schema_update_options,
								default: '[ ]',
								description:
									'Specifies updates to the destination table schema to allow as a side effect of the load job.'
							},
							{
								id: 'bq_load_job_null_marker',
								label: 'Null Marker',
								value: this.item.bq_load_job_null_marker,
								default: '""',
								description: 'Represents a null value (CSV only).'
							},
							{
								id: 'bq_load_job_allow_quoted_newlines',
								label: 'Allow quoted new lines',
								value: this.item.bq_load_job_allow_quoted_newlines,
								default: 'false',
								description: 'Allow quoted data containing newline characters (CSV only).'
							},
							{
								id: 'bq_load_job_allow_jagged_rows',
								label: 'Allow jagged rows',
								value: this.item.bq_load_job_allow_jagged_rows,
								default: 'false',
								description: 'Allow missing trailing optional columns (CSV only).'
							}
						]
					}
				},
				{
					component: 'create-update-conf-overview',
					props: {
						creationDate: this.item.creation_date,
						updateDate: this.item.update_date,
						createdBy: this.item.created_by,
						updatedBy: this.item.updated_by
					}
				}
			];
		}
	}
};
</script>