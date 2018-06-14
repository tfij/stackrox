import { selectors } from './constants/IntegrationsPage';
import * as api from './constants/apiEndpoints';

describe('Integrations page', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get(selectors.configure).click();
        cy.get(selectors.navLink).click();
    });

    it('Plugin tiles should all be the same height', () => {
        let value = null;
        cy.get(selectors.plugins).each($el => {
            if (value) expect($el[0].clientHeight).to.equal(value);
            else value = $el[0].clientHeight;
        });
    });

    it('should have selected item in nav bar', () => {
        cy.get(selectors.configure).should('have.class', 'bg-primary-600');
    });

    it('should allow integration with Slack', () => {
        cy.get('div.ReactModalPortal').should('not.exist');

        cy.get(selectors.slackTile).click();
        cy.get('div.ReactModalPortal');
    });

    it.only('should add an integration with DockerHub', () => {
        cy.get(selectors.dockerRegistryTile).click();
        cy.get(selectors.buttons.add).click();

        const name = `Docker Registry ${Math.random()
            .toString(36)
            .substring(7)}`;
        cy.get(selectors.dockerRegistryForm.nameInput).type(name);

        cy.get(`${selectors.dockerRegistryForm.typesSelect} .Select-arrow`).click();
        cy
            .get(
                `${
                    selectors.dockerRegistryForm.typesSelect
                } div[role="option"]:contains("Registry")`
            )
            .click();

        // test that validation error happens when form is incomplete
        cy.get(selectors.buttons.test).click();
        cy.get(selectors.integrationError);

        cy.get(selectors.dockerRegistryForm.endpointInput).type('registry-1.docker.io');

        cy.get(selectors.buttons.create).click();

        // delete the integration after to clean up
        cy.get(`table tr:contains("${name}") td input[type="checkbox"]`).check();
        cy.get(selectors.buttons.delete).click();
        cy.get(selectors.buttons.confirm).click();
        cy.get(`table tr:contains("${name}")`).should('not.exist');
    });
});

describe('Cluster Creation Flow', () => {
    beforeEach(() => {
        cy.server();
        cy.fixture('clusters/single.json').as('singleCluster');
        cy.route('GET', api.clusters.list, '@singleCluster').as('clusters');
        cy.route('POST', api.clusters.zip, {}).as('download');
        cy.route('POST', api.clusters.list, { id: 'kubeCluster1' }).as('addCluster');
        cy.visit('/');
        cy.get(selectors.configure).click();
        cy.get(selectors.navLink).click();
        cy.wait('@clusters');
    });

    it('Should show a confirmation dialog when trying to delete clusters', () => {
        cy.get(selectors.dockerSwarmTile).click();
        cy.get(selectors.dialog).should('not.exist');
        cy.get(selectors.checkboxes).check();
        cy.get(selectors.buttons.delete).click();
        cy.get(selectors.dialog);
    });

    it('Should show the remote cluster when clicking the Docker Swarm tile', () => {
        cy.get(selectors.dockerSwarmTile).click();

        cy.get(selectors.clusters.swarmCluster1);
    });

    it('Should show a disabled form when viewing a specific cluster', () => {
        cy.get(selectors.dockerSwarmTile).click();

        cy.get(selectors.clusters.swarmCluster1).click();

        cy
            .get(selectors.readOnlyView)
            .eq(0)
            .should('have.text', 'Name:Swarm Cluster 1');

        cy
            .get(selectors.readOnlyView)
            .eq(1)
            .should('have.text', 'Cluster Type:SWARM_CLUSTER');

        cy
            .get(selectors.readOnlyView)
            .eq(2)
            .should('have.text', 'Image name (Prevent location):stackrox/prevent:latest');

        cy
            .get(selectors.readOnlyView)
            .eq(3)
            .should('have.text', 'Central API Endpoint:central.stackrox:443');
    });

    it('Should be able to fill out the Swarm form and download a ZIP when clicking "Add"', () => {
        cy.get(selectors.dockerSwarmTile).click();

        cy.get(selectors.buttons.add).click();

        cy.get(selectors.clusterForm.nameInput).type('Swarm Cluster 1');
        cy.get(selectors.clusterForm.imageInput).type('stackrox/prevent:latest');
        cy.get(selectors.clusterForm.endpointInput).type('central.prevent_net:443');

        cy.get(selectors.buttons.next).click();
        cy.wait('@addCluster');

        cy.get(selectors.buttons.download, { timeout: 500 }).click();
        cy.wait('@download');
    });
});
