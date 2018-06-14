import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Text, Select, Checkbox } from 'react-form';
import { withRouter } from 'react-router-dom';
import MultiSelect from 'react-select';
import * as Icon from 'react-feather';

import Dialog from 'Components/Dialog';
import Modal from 'Components/Modal';
import Table from 'Components/Table';
import Panel from 'Components/Panel';
import tableColumnDescriptor from 'Containers/Integrations/tableColumnDescriptor';
import sourceMap from 'Containers/Integrations/integrationsSourceMap';
import * as AuthService from 'services/AuthService';
import { saveIntegration, testIntegration, deleteIntegration } from 'services/IntegrationsService';

import { clusterTypeLabels } from 'messages/common';

const SOURCE_LABELS = Object.freeze({
    authProviders: 'authentication provider',
    imageIntegrations: 'image integrations',
    notifiers: 'plugin'
});

const reducer = (action, prevState, nextState) => {
    switch (action) {
        case 'EDIT_INTEGRATION':
            return { editIntegration: nextState.editIntegration };
        case 'CLEAR_MESSAGES':
            return { errorMessage: '', successMessage: '' };
        case 'ERROR_MESSAGE':
            return { errorMessage: nextState.errorMessage };
        case 'SUCCESS_MESSAGE':
            return { successMessage: nextState.successMessage };
        default:
            return prevState;
    }
};

class IntegrationModal extends Component {
    static propTypes = {
        integrations: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.string.isRequired
            })
        ).isRequired,
        source: PropTypes.oneOf(['imageIntegrations', 'notifiers', 'authProviders', 'clusters'])
            .isRequired,
        type: PropTypes.string.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        onIntegrationsUpdate: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            editIntegration: null,
            errorMessage: '',
            successMessage: '',
            showConfirmationDialog: false
        };
    }

    onRequestClose = isSuccessful => {
        this.update('CLEAR_MESSAGES');
        this.props.onRequestClose(isSuccessful);
    };

    onTest = () => {
        this.update('CLEAR_MESSAGES');
        const data = this.addDefaultFormValues(this.formApi.values);
        testIntegration(this.props.source, data)
            .then(() => {
                this.update('SUCCESS_MESSAGE', {
                    successMessage: 'Integration test was successful'
                });
            })
            .catch(error => {
                this.update('ERROR_MESSAGE', { errorMessage: error.response.data.error });
            });
    };

    onSubmit = formData => {
        this.update('CLEAR_MESSAGES');
        const data = this.addDefaultFormValues(formData);
        const promise =
            this.props.source === 'authProviders'
                ? AuthService.saveAuthProvider(data)
                : saveIntegration(this.props.source, data);
        promise
            .then(() => {
                this.props.onIntegrationsUpdate(this.props.source);
                this.update('EDIT_INTEGRATION', { editIntegration: null });
            })
            .catch(error => {
                this.update('ERROR_MESSAGE', { errorMessage: error.response.data.error });
            });
    };

    addDefaultFormValues = formData => {
        const data = formData;
        const { location } = window;
        data.uiEndpoint = this.props.source === 'authProviders' ? location.host : location.origin;
        data.type = this.props.type;
        data.enabled = true;
        return data;
    };

    addIntegration = () => {
        this.update('EDIT_INTEGRATION', { editIntegration: {} });
    };

    deleteIntegration = () => {
        const promises = [];
        this.integrationTable.getSelectedRows().forEach(data => {
            const promise =
                this.props.source === 'authProviders'
                    ? AuthService.deleteAuthProvider(data.id)
                    : deleteIntegration(this.props.source, data);
            promises.push(promise);
        });
        Promise.all(promises).then(() => {
            this.integrationTable.clearSelectedRows();
            this.hideConfirmationDialog();
            this.props.onIntegrationsUpdate(this.props.source);
        });
    };

    showConfirmationDialog = () => {
        this.setState({ showConfirmationDialog: true });
    };

    hideConfirmationDialog = () => {
        this.setState({ showConfirmationDialog: false });
    };

    update = (action, nextState) => {
        this.setState(prevState => reducer(action, prevState, nextState));
    };

    renderTable = () => {
        const header = `${
            this.props.source !== 'clusters' ? this.props.type : clusterTypeLabels[this.props.type]
        } Integrations`;
        const buttons =
            this.props.source !== 'clusters'
                ? [
                      {
                          renderIcon: () => <Icon.Trash2 className="h-4 w-4" />,
                          text: 'Delete',
                          className: 'btn-danger',
                          onClick: this.showConfirmationDialog,
                          disabled: this.state.editIntegration !== null
                      },
                      {
                          renderIcon: () => <Icon.Plus className="h-4 w-4" />,
                          text: 'Add',
                          className: 'btn-success',
                          onClick: this.addIntegration,
                          disabled: this.state.editIntegration !== null
                      }
                  ]
                : [
                      {
                          renderIcon: () => <Icon.Trash2 className="h-4 w-4" />,
                          text: 'Delete',
                          className:
                              'flex py-1 px-2 rounded-sm text-danger-600 hover:text-white hover:bg-danger-400 uppercase text-center text-sm items-center ml-2 bg-white border-2 border-danger-400',
                          onClick: this.deleteIntegration,
                          disabled: this.state.editIntegration !== null
                      },
                      {
                          renderIcon: () => <Icon.Plus className="h-4 w-4" />,
                          text: 'Add Integration',
                          className:
                              'flex py-1 px-2 rounded-sm text-success-600 hover:text-white hover:bg-success-400 uppercase text-center text-sm items-center ml-2 bg-white border-2 border-success-400',
                          onClick: this.addIntegration,
                          disabled: this.state.editIntegration !== null
                      }
                  ];
        const columns =
            this.props.source !== 'clusters'
                ? tableColumnDescriptor[this.props.source][this.props.type]
                : tableColumnDescriptor[this.props.source];
        const rows = this.props.integrations;
        const onRowClickHandler = () => integration => {
            if (this.props.source !== 'clusters')
                this.update('EDIT_INTEGRATION', { editIntegration: integration });
        };

        return (
            <div className="flex flex-1">
                <Panel header={header} buttons={buttons}>
                    {rows.length !== 0 ? (
                        <Table
                            columns={columns}
                            rows={rows}
                            checkboxes={this.props.source !== 'clusters'}
                            onRowClick={onRowClickHandler()}
                            ref={table => {
                                this.integrationTable = table;
                            }}
                        />
                    ) : (
                        <div className="p3 w-full my-auto text-center capitalize">
                            {`No ${
                                this.props.source !== 'clusters'
                                    ? this.props.type
                                    : clusterTypeLabels[this.props.type]
                            } integrations`}
                        </div>
                    )}
                </Panel>
            </div>
        );
    };

    renderField = field => {
        const handleMultiSelectChange = () => newValue => {
            const values = newValue !== '' ? newValue.split(',') : [];
            this.formApi.setValue(field.key, values);
        };
        switch (field.type) {
            case 'checkbox':
                return <Checkbox field={field.key} name={field.key} disabled={field.disabled} />;
            case 'text':
                return (
                    <Text
                        type="text"
                        className="border rounded w-full p-3 border-base-300"
                        field={field.key}
                        id={field.key}
                        placeholder={field.placeholder}
                    />
                );
            case 'password':
                return (
                    <Text
                        type="password"
                        className="border rounded w-full p-3 border-base-300"
                        field={field.key}
                        id={field.key}
                        placeholder={field.placeholder}
                    />
                );
            case 'select':
                return (
                    <Select
                        field={field.key}
                        id={field.key}
                        options={field.options}
                        placeholder={field.placeholder}
                        className="border rounded w-full p-3 border-base-300"
                    />
                );

            case 'multiselect':
                return (
                    <MultiSelect
                        key={field.key}
                        multi
                        onChange={handleMultiSelectChange()}
                        options={field.options}
                        placeholder={field.placeholder}
                        removeSelected
                        simpleValue
                        value={this.formApi.values[field.key]}
                        className="text-base-600 font-400 w-full"
                    />
                );
            default:
                return '';
        }
    };

    renderFields = () => {
        const fields = sourceMap[this.props.source][this.props.type];
        return fields.map(field => (
            <label className="flex mt-4" htmlFor={field.key} key={field.label}>
                <div className="mr-4 flex items-center w-2/3 capitalize">{field.label}</div>
                {this.renderField(field)}
            </label>
        ));
    };

    renderForm = () => {
        if (!this.state.editIntegration) return '';
        const header = this.state.editIntegration.name || 'New Integration';
        const buttons = [
            {
                renderIcon: () => <Icon.X className="h-4 w-4" />,
                text: 'Cancel',
                className: 'btn-primary',
                onClick: () => {
                    this.update('EDIT_INTEGRATION', { editIntegration: null });
                }
            },
            {
                renderIcon: () => <Icon.Save className="h-4 w-4" />,
                text: `${this.state.editIntegration.name ? 'Save' : 'Create'}`,
                className: 'btn-success',
                onClick: () => {
                    this.formApi.submitForm();
                }
            }
        ];
        if (this.props.source !== 'authProviders') {
            const testButton = {
                renderIcon: () => <Icon.Check className="h-4 w-4" />,
                text: 'Test',
                className: 'btn-primary',
                onClick: () => {
                    this.onTest();
                }
            };
            buttons.splice(1, 0, testButton);
        }
        const key = this.state.editIntegration
            ? this.state.editIntegration.name
            : 'new-integration';
        const FormContent = props => {
            this.formApi = props.formApi;
            return (
                <form onSubmit={props.formApi.submitForm} className="w-full p-4">
                    <div>{this.renderFields()}</div>
                </form>
            );
        };
        return (
            <div className="flex flex-1">
                <Panel header={header} buttons={buttons}>
                    <Form
                        onSubmit={this.onSubmit}
                        validateSuccess={this.validateSuccess}
                        defaultValues={this.state.editIntegration}
                        key={key}
                    >
                        <FormContent />
                    </Form>
                </Panel>
            </div>
        );
    };

    renderConfirmationDialog = () => {
        const numSelectedRows = this.integrationTable
            ? this.integrationTable.getSelectedRows().length
            : 0;
        return (
            <Dialog
                isOpen={this.state.showConfirmationDialog}
                text={`Are you sure you want to delete ${numSelectedRows} integration(s)?`}
                onConfirm={this.deleteIntegration}
                onCancel={this.hideConfirmationDialog}
            />
        );
    };

    render() {
        const { source, type } = this.props;
        return (
            <Modal isOpen onRequestClose={this.onRequestClose} className="w-full lg:w-5/6 h-full">
                <header className="flex items-center w-full p-4 bg-primary-500 text-white uppercase">
                    <span className="flex flex-1">
                        {source !== 'clusters'
                            ? `Configure ${type} ${SOURCE_LABELS[source]}`
                            : `Configure ${clusterTypeLabels[type]}`}
                    </span>
                    <Icon.X className="h-4 w-4 cursor-pointer" onClick={this.onRequestClose} />
                </header>
                {this.state.errorMessage !== '' && (
                    <div
                        className="px-4 py-2 bg-high-500 text-white"
                        data-test-id="integration-error"
                    >
                        {this.state.errorMessage}
                    </div>
                )}
                {this.state.successMessage !== '' && (
                    <div className="px-4 py-2 bg-success-500 text-white">
                        {this.state.successMessage}
                    </div>
                )}
                <div className="flex flex-1 w-full bg-white">
                    {this.renderTable()}
                    {this.renderForm()}
                </div>
                {this.renderConfirmationDialog()}
            </Modal>
        );
    }
}

export default withRouter(IntegrationModal);
