<template>
	<div>
		<v-list class="pa-0">
			<v-list-item>
				<v-list-item-content v-if="!drawer.mini">
					<v-list-item-title>
						<h2 class="text-uppercase">{{ appName }}</h2>
					</v-list-item-title>
				</v-list-item-content>

				<v-list-item-action>
					<v-btn icon @click.stop="drawer.mini = !drawer.mini">
						<v-icon large color="complementary">
							{{ drawer.mini ? 'keyboard_arrow_right' : 'keyboard_arrow_left' }}
						</v-icon>
					</v-btn>
				</v-list-item-action>
			</v-list-item>
		</v-list>

		<v-divider v-if="!drawer.mini" />

		<v-list class="pa-0">
			<v-list-item to="/" exact>
				<v-list-item-action>
					<v-icon>home</v-icon>
				</v-list-item-action>

				<v-list-item-content>
					<v-list-item-title>Project Overview</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>

		<v-divider />

		<v-list v-if="!drawer.mini" subheader>
			<v-subheader class="text-uppercase">Data models</v-subheader>
			<data-model-tree-view />
		</v-list>

		<v-divider />

		<v-list subheader>
			<v-subheader v-if="!drawer.mini" class="text-uppercase">Data Workflows</v-subheader>

			<v-tooltip
				v-slot:activator="{ on }"
				v-for="item in analyticsItems"
				:key="item.link"
				:disabled="!drawer.mini"
				right
			>
				<v-list-item :to="item.link" exact slot="activator">
					<v-list-item-action>
						<v-icon v-html="item.icon" />
					</v-list-item-action>

					<v-list-item-content>
						<v-list-item-title v-text="item.title" />
					</v-list-item-content>
				</v-list-item>
			</v-tooltip>
		</v-list>

		<v-divider />

		<v-list subheader>
			<v-subheader v-if="!drawer.mini" class="text-uppercase">Settings</v-subheader>

			<v-list-item v-for="setting in settingsItems" :key="setting.title" :to="{ path: setting.path }">
				<v-list-item-action>
					<v-icon v-html="setting.icon" />
				</v-list-item-action>

				<v-list-item-content>
					<v-list-item-title v-text="setting.title" />
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</div>
</template>

<script>
import DataModelTreeView from './sub-components/DatamodelTreeview';

import packageJson from '../../../package';

export default {
	name: 'navigation-content',
	components: { DataModelTreeView },
	props: {
		drawer: {
			type: Object,
			required: true
		},
		analyticsItems: {
			type: Array,
			required: true
		},
		settingsItems: {
			type: Array,
			required: true
		}
	},
	computed: {
		appName() {
			return packageJson.name.replace('-', ' ');
		}
	}
};
</script>