import axios from './instance';

function getPath(type, action) {
    switch (type) {
        case 'imageIntegrations':
            return '/v1/imageintegrations';
        case 'notifiers':
            return '/v1/notifiers';
        case 'backups':
            return '/v1/externalbackups';
        case 'authPlugins':
            if (action === 'test') {
                return '/v1/scopedaccessctrl';
            }
            if (action === 'fetch') {
                return '/v1/scopedaccessctrl/configs';
            }
            return '/v1/scopedaccessctrl/config';
        default:
            return '';
    }
}

function getJsonFieldBySource(source) {
    switch (source) {
        case 'notifiers':
            return 'notifier';
        case 'backups':
            return 'externalBackup';
        default:
            return 'config';
    }
}

/**
 * Fetches list of registered integrations based on source.
 *
 * @returns {Promise<Object, Error>} fulfilled with array of the integration source
 */
export function fetchIntegration(source) {
    const path = getPath(source, 'fetch');
    return axios.get(path).then((response) => ({
        response: response.data,
    }));
}

/**
 * Saves an integration by source. If it can potentially use stored credentials, use the
 * updatePassword option to determine if you should
 *
 * @param {string} source - The source of the integration
 * @param {Object} data - The form data
 * @param {Object} options - Contains a field like "updatePassword" to determine what API to use
 * @returns {Promise<Object, Error>}
 */
export function saveIntegration(source, data, options = undefined) {
    if (!data.id) {
        throw new Error('Integration entity must have an id to be saved');
    }
    const updatePassword = options?.updatePassword;
    // if the integration is not one that could possibly have stored credentials, use the previous API
    if (updatePassword === undefined) {
        return axios.put(`${getPath(source, 'save')}/${data.id}`, data);
    }
    // if it does, format the request data and use the new API
    const integration = {
        [getJsonFieldBySource(source)]: data,
        updatePassword,
    };
    return axios.patch(`${getPath(source, 'save')}/${data.id}`, integration);
}

// When we migrate completely over, we can remove saveIntegration and rename this
export function saveIntegrationV2(source, data) {
    if (Object.prototype.hasOwnProperty.call(data, 'updatePassword')) {
        const { id } = data[getJsonFieldBySource(source)];
        return axios.patch(`${getPath(source, 'save')}/${id}`, data);
    }
    return axios.put(`${getPath(source, 'save')}/${data.id}`, data);
}

/**
 * Creates an integration by source.
 *
 * @returns {Promise<Object, Error>}
 */
export function createIntegration(source, data) {
    // if the data has a config object, use the contents of that config object
    const hasUpdatePassword = Object.prototype.hasOwnProperty.call(data, 'updatePassword');
    const createData = hasUpdatePassword ? data[getJsonFieldBySource(source)] : data;

    return axios.post(getPath(source, 'create'), createData);
}

/**
 * Tests an integration by source. If it can potentially use stored credentials, use the
 * updatePassword option to determine if you should
 *
 * @param {string} source - The source of the integration
 * @param {Object} data - The form data
 * @param {Object} options - Contains a field like "updatePassword" to determine what API to use
 * @returns {Promise<Object, Error>}
 */
export function testIntegration(source, data, options = undefined) {
    const updatePassword = options?.updatePassword;
    // if the integration is not one that could possibly have stored credentials, use the previous API
    if (updatePassword === undefined) {
        return axios.post(`${getPath(source, 'test')}/test`, data);
    }
    // if it does, format the request data and use the new API
    const integration = {
        [getJsonFieldBySource(source)]: data,
        updatePassword,
    };
    return axios.post(`${getPath(source, 'test')}/test/updated`, integration);
}

// When we migrate completely over, we can remove testIntegration and rename this
export function testIntegrationV2(source, data) {
    if (Object.prototype.hasOwnProperty.call(data, 'updatePassword')) {
        return axios.post(`${getPath(source, 'test')}/test/updated`, data);
    }
    return axios.post(`${getPath(source, 'test')}/test`, data);
}

/**
 * Deletes an integration by source.
 *
 * @returns {Promise<Object, Error>}
 */
export function deleteIntegration(source, id) {
    return axios.delete(`${getPath(source, 'delete')}/${id}`);
}

/**
 * Deletes a list of integrations by source.
 *
 * @returns {Promise<Object, Error>}
 */
export function deleteIntegrations(source, ids = []) {
    return Promise.all(ids.map((id) => deleteIntegration(source, id)));
}

/**
 * Triggers a DB backup
 *
 * @returns {Promise<Object, Error>}
 */
export function triggerBackup(id) {
    return axios.post(`${getPath('backups', 'trigger')}/${id}`);
}
