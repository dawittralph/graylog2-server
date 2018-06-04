import Reflux from 'reflux';
import lodash from 'lodash';
import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';
import { fetchPeriodically } from 'logic/rest/FetchProvider';
import CombinedProvider from 'injection/CombinedProvider';

const { AdministrationActions } = CombinedProvider.get('Administration');

const AdministrationStore = Reflux.createStore({
  listenables: [AdministrationActions],
  sourceUrl: '/plugins/org.graylog.plugins.sidecar/sidecar',
  sidecars: undefined,
  filters: undefined,
  pagination: {
    count: undefined,
    page: undefined,
    pageSize: undefined,
    total: undefined,
  },
  query: undefined,

  propagateChanges() {
    this.trigger({
      sidecars: this.sidecars,
      filters: this.filters,
      query: this.query,
      pagination: this.pagination,
    });
  },

  list({ query = '', page = 1, pageSize = 50, filters }) {
    const body = {
      query: query,
      page: page,
      per_page: pageSize,
      filters: filters,
    };

    const promise = fetchPeriodically('POST', URLUtils.qualifyUrl(`${this.sourceUrl}/administration`), body);

    promise.then(
      (response) => {
        this.sidecars = response.sidecars;
        this.query = response.query;
        this.filters = response.filters;
        this.pagination = {
          total: response.total,
          count: response.count,
          page: response.page,
          pageSize: response.per_page,
        };
        this.propagateChanges();

        return response;
      },
      (error) => {
        UserNotification.error(`Fetching Sidecars failed with status: ${error}`,
          'Could not retrieve Sidecars');
      });

    AdministrationActions.list.promise(promise);
  },

  setAction(action, collectors) {
    const sidecarIds = Object.keys(collectors);
    const formattedCollectors = sidecarIds.map(sidecarId => ({
      sidecar_id: sidecarId,
      collector_ids: collectors[sidecarId],
    }));
    const body = {
      action: action,
      collectors: formattedCollectors,
    };

    const promise = fetchPeriodically('PUT', URLUtils.qualifyUrl(`${this.sourceUrl}/administration/action`), body);

    promise.then(
      (response) => {
        UserNotification.success('', `${lodash.upperFirst(action)} for ${formattedCollectors.length} collectors requested`);
        return response;
      },
      (error) => {
        UserNotification.error(`Requesting ${action} failed with status: ${error}`,
          `Could not ${action} collectors`);
      });

    AdministrationActions.setAction.promise(promise);
  },
});

export default AdministrationStore;
