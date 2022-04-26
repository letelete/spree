<template>
  <div id="my-account">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <SfContentPages
      v-e2e="'my-account-content-pages'"
      :title="$t('pages.my_account.content_page_title_my_account')"
      :active="activePageTitle"
      class="my-account"
      @click:change="changeActivePage"
    >
      <SfContentCategory
        :title="$t('pages.my_account.content_category_title_personal_details')"
      >
        <SfContentPage
          :title="$t('pages.my_account.content_page_title_my_profile')"
        >
          <MyProfile />
        </SfContentPage>

        <SfContentPage
          :title="$t('pages.my_account.content_page_title_saved_addresses')"
        >
          <SavedAddressesDetails />
        </SfContentPage>
      </SfContentCategory>

      <SfContentCategory
        :title="$t('pages.my_account.content_category_title_order_details')"
      >
        <SfContentPage
          :title="$t('pages.my_account.content_page_title_order_history')"
        >
          <OrderHistory />
        </SfContentPage>
      </SfContentCategory>

      <SfContentPage
        :title="$t('pages.my_account.content_page_title_log_out')"
      />
    </SfContentPages>
  </div>
</template>
<script>
import { SfBreadcrumbs, SfContentPages } from '@storefront-ui/vue';
import {
  computed,
  useRoute,
  useRouter,
  useContext
} from '@nuxtjs/composition-api';
import { useUser } from '@vue-storefront/spree';
import MyProfile from './MyAccount/MyProfile';
import SavedAddressesDetails from './MyAccount/SavedAddressesDetails';
import MyNewsletter from './MyAccount/MyNewsletter';
import OrderHistory from './MyAccount/OrderHistory';

export default {
  name: 'MyAccount',
  components: {
    SfBreadcrumbs,
    SfContentPages,
    MyProfile,
    SavedAddressesDetails,
    MyNewsletter,
    OrderHistory
  },
  middleware: ['is-authenticated'],
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const { logout } = useUser();
    const baseContext = useContext();

    const handleOpenPage = async (page) => {
      router.push(page.localizedPath);
    };

    const handleLogout = async () => {
      await logout();
      router.push(context.root.localePath({ name: 'home' }));
    };

    const pages = computed(() => [
      { path: '/my-account', i18nKey: 'pages.my_account.content_page_title_my_profile', onActive: handleOpenPage},
      { path: '/my-account/my-profile', i18nKey: 'pages.my_account.content_page_title_my_profile', onActive: handleOpenPage },
      { path: '/my-account/saved-addresses', i18nKey: 'pages.my_account.content_page_title_saved_addresses', onActive: handleOpenPage },
      { path: '/my-account/order-history', i18nKey: 'pages.my_account.content_page_title_order_history', onActive: handleOpenPage },
      { path: '/my-account/log-out', i18nKey: 'pages.my_account.content_page_title_log_out', onActive: handleLogout }
    ].map((page) => ({
      ...page,
      localizedPath: baseContext.localePath(page.path),
      localizedTitle: context.root.$i18n.t(page.i18nKey)
    })));

    const findPageByLocalizedPath = (path) => pages.value.find(({ localizedPath }) => localizedPath === path);

    const findPageByLocalizedTitle = (title) => pages.value.find(({ localizedTitle }) => localizedTitle === title);

    const changeActivePage = async (title) => {
      const page = findPageByLocalizedTitle(title);
      await page.onActive(page);
    };

    const activePageTitle = computed(() => {
      const { path } = route.value;
      console.log(route.value);
      return findPageByLocalizedPath(path)?.localizedTitle || '';
    });

    return { changeActivePage, activePageTitle };
  },

  data(root) {
    return {
      breadcrumbs: [
        {
          text: 'Home',
          link: root.localePath('/')
        },
        {
          text: 'My Account',
          link: root.localePath('/my-account')
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
#my-account {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.my-account {
  @include for-mobile {
    --content-pages-sidebar-category-title-font-weight: var(
      --font-weight--normal
    );
    --content-pages-sidebar-category-title-margin: var(--spacer-sm)
      var(--spacer-sm) var(--spacer-sm) var(--spacer-base);
  }
  @include for-desktop {
    --content-pages-sidebar-category-title-margin: var(--spacer-xl) 0 0 0;
  }
}
.breadcrumbs {
  margin: var(--spacer-base) 0 var(--spacer-lg);
}
</style>
