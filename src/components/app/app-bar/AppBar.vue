<template>
	<v-app-bar app dark color="primary" elevate-on-scroll>
		<v-app-bar-nav-icon v-if="!$vuetify.breakpoint.lgAndUp" @click="$emit('toggleNavigation')" />

		<span class="cursor--pointer" @click="removeFilteredAccount">
			{{ $store.getters['filters/filteredAccounts'][0].account_name }}
		</span>

		<v-spacer />

		<!-- <search-menu v-if="$vuetify.breakpoint.smAndUp" /> -->

		<!-- <v-btn icon @click="$emit('toggleNotifications')">
			<v-badge color="red" overlap>
				<span slot="badge">2</span>
				<v-icon>notifications</v-icon>
			</v-badge>
		</v-btn> -->

		<v-chip outlined>
			<v-icon left>mdi-fire</v-icon>
			<a href="#" class="ak-trigger">
				<span class="white--text">
					What's new &nbsp;
				</span>
				<AnnounceKit catchClick=".ak-trigger" widget="https://announcekit.app/widgets/v2/Ydr0Y" />
			</a>
		</v-chip>

		<v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
			<template v-slot:activator="{ on }">
				<v-btn icon large v-on="on">
					<v-avatar v-if="isAuthenticated && user && user.photoURL != null" size="32px">
						<img :src="user.photoURL" :alt="user.displayName" />
					</v-avatar>

					<v-avatar v-else size="32px">
						<v-icon dark>account_circle</v-icon>
					</v-avatar>
				</v-btn>
			</template>

			<v-list>
				<v-list-item
					v-for="(item, index) in userSettingsItems"
					:key="index"
					:to="item.link"
					:disabled="item.disabled"
					:target="item.target"
					rel="noopener"
				>
					<v-list-item-action>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-action>

					<v-list-item-content>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-menu>

		<v-btn icon @click="toggleFullScreen">
			<v-icon>fullscreen</v-icon>
		</v-btn>
	</v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { User } from '@/types';

import SearchMenu from './sub-components/SearchMenu.vue';

import { UserSetting, userSettings } from '@/navigation/user-settings-items';
import AnnounceKit from 'announcekit-vue';

@Component({
	components: { SearchMenu, AnnounceKit },
})
export default class AppBar extends Vue {
	@State((state) => state.user.isAuthenticated) isAuthenticated!: boolean;
	@State((state) => state.user.user) user!: User;

	userSettingsItems: UserSetting[] = userSettings;

	removeFilteredAccount() {
		this.$store.dispatch('filters/updateFilteredAccounts', []);
	}

	toggleFullScreen() {
		const doc = window.document as Document & {
			mozFullScreenElement(): Promise<void>;
			webkitFullscreenElement(): Promise<void>;
			msFullscreenElement(): Promise<void>;
			mozCancelFullScreen(): Promise<void>;
			webkitExitFullscreen(): Promise<void>;
			msExitFullscreen(): Promise<void>;
		};

		const docEl = doc.documentElement as HTMLElement & {
			mozRequestFullScreen(): Promise<void>;
			webkitRequestFullScreen(): Promise<void>;
			msRequestFullscreen(): Promise<void>;
		};

		const requestFullScreen =
			docEl.requestFullscreen ||
			docEl.mozRequestFullScreen ||
			docEl.webkitRequestFullScreen ||
			docEl.msRequestFullscreen;
		const cancelFullScreen =
			doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

		if (
			!doc.fullscreenElement &&
			!doc.mozFullScreenElement &&
			!doc.webkitFullscreenElement &&
			!doc.msFullscreenElement
		) {
			requestFullScreen.call(docEl);
		} else {
			cancelFullScreen.call(doc);
		}
	}
}
</script>
