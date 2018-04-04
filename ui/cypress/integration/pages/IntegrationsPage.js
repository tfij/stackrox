export const url = '/main/integrations';

export const selectors = {
    configure: 'nav.left-navigation li:contains("Configure") a',
    navLink: '.navigation-panel li:contains("Integrations") a',
    dockerSwarmTile: 'button:contains("Docker Swarm")',
    clusters: {
        swarmCluster1: 'tr:contains("Swarm Cluster 1")'
    },
    buttons: {
        addCluster: 'button:contains("Add")',
        next: 'button:contains("Next")',
        download: 'button:contains("Download")'
    },
    form: 'form input',
    readOnlyView: '.overflow-auto > .p-4 > div'
};
