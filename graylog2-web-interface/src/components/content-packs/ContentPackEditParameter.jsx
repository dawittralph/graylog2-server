import PropTypes from 'prop-types';
import React from 'react';

import { Row, Col, Button } from 'react-bootstrap';
import { Input } from 'components/bootstrap';

import FormsUtils from 'util/FormsUtils';
import ObjectUtils from 'util/ObjectUtils';

class ContentPackEditParameter extends React.Component {
  static propTypes = {
    onUpdateParameter: PropTypes.func,
    parameters: PropTypes.array,
    parameterToEdit: PropTypes.object,
  };

  static defaultProps = {
    onUpdateParameter: () => { },
    parameters: [],
    parameterToEdit: undefined,
  };

  static emptyParameter = {
    name: '',
    title: '',
    description: '',
    type: 'string',
    default_value: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      newParameter: props.parameterToEdit || ObjectUtils.clone(ContentPackEditParameter.emptyParameter),
      defaultValueError: undefined,
      nameError: undefined,
    };
  }

  _updateField = (name, value) => {
    const updatedParameter = ObjectUtils.clone(this.state.newParameter);
    updatedParameter[name] = value;
    this.setState({ newParameter: updatedParameter });
  };

  _bindValue = (event) => {
    this._updateField(event.target.name, FormsUtils.getValueFromInput(event.target));
  };

  _addNewParameter = (e) => {
    e.preventDefault();

    if (!this._validateParameter()) {
      return;
    }

    this.props.onUpdateParameter(this.state.newParameter);
    this.setState({ newParameter: ObjectUtils.clone(ContentPackEditParameter.emptyParameter) });
  };

  _validateParameter() {
    const param = this.state.newParameter;
    if (!param.name || !param.title || !param.description) {
      return false;
    }
    return this._validateDefaultValue() && this._validateName();
  }

  _validateName = () => {
    const value = this.state.newParameter.name;
    if (value.match(/\W/)) {
      this.setState({ nameError: 'The parameter name must only contain A-Z, a-z, 0-9 and _' });
      return false;
    }

    if (!this.props.parameterToEdit && this.props.parameters
      .findIndex((parameter) => { return parameter.name === value; }) >= 0) {
      this.setState({ nameError: 'The parameter name must be unique.' });
      return false;
    }

    this.setState({ nameError: undefined });
    return true;
  };

  _validateDefaultValue = () => {
    const value = this.state.newParameter.default_value;
    if (value) {
      switch (this.state.newParameter.type) {
        case 'integer': {
          if (`${parseInt(value, 10)}` !== value) {
            this.setState({ defaultValueError: 'This is not an integer value.' });
            return false;
          }
          break;
        }
        case 'double': {
          if (isNaN(value)) {
            this.setState({ defaultValueError: 'This is not a double value.' });
            return false;
          }
          break;
        }
        case 'boolean': {
          if (value !== 'true' && value !== 'false') {
            this.setState({ defaultValueError: 'This is not a boolean value. It must be either true or false.' });
            return false;
          }
          break;
        }
        default:
          break;
      }
    }
    this.setState({ defaultValueError: undefined });
    return true;
  };

  render() {
    const header = this.props.parameterToEdit ? 'Edit parameter' : 'Create parameter';
    return (
      <div>
        <h2>{header}</h2>
        <br />
        <form className="form-horizontal parameter-form" id="parameter-form" onSubmit={this._addNewParameter}>
          <fieldset>
            <Input name="title"
                   id="title"
                   type="text"
                   maxLength={250}
                   value={this.state.newParameter.title}
                   onChange={this._bindValue}
                   labelClassName="col-sm-3"
                   wrapperClassName="col-sm-9"
                   label="Title"
                   help="Give a descriptive title for this content pack."
                   required />
            <Input name="name"
                   id="name"
                   type="text"
                   maxLength={250}
                   bsStyle={this.state.nameError ? 'error' : null}
                   value={this.state.newParameter.name}
                   onChange={this._bindValue}
                   labelClassName="col-sm-3"
                   wrapperClassName="col-sm-9"
                   label="Name"
                   help={this.state.nameError ? this.state.nameError :
                     'This is used as the parameter reference and must not contain a space.'}
                   required />
            <Input name="description"
                   id="description"
                   type="text"
                   maxLength={250}
                   value={this.state.newParameter.description}
                   onChange={this._bindValue}
                   labelClassName="col-sm-3"
                   wrapperClassName="col-sm-9"
                   label="Description"
                   help="Give a description explaining what will be done with this parameter."
                   required />
            <Input name="type"
                   id="type"
                   type="select"
                   value={this.state.newParameter.type}
                   onChange={this._bindValue}
                   labelClassName="col-sm-3"
                   wrapperClassName="col-sm-9"
                   label="Value Type"
                   help="Give the type of the parameter."
                   required>
              <option value="string">String</option>
              <option value="integer">Integer</option>
              <option value="double">Double</option>
              <option value="boolean">Boolean</option>
            </Input>
            <Input name="default_value"
                   id="default_value"
                   type="text"
                   maxLength={250}
                   bsStyle={this.state.defaultValueError ? 'error' : null}
                   value={this.state.newParameter.default_value}
                   onChange={this._bindValue}
                   labelClassName="col-sm-3"
                   wrapperClassName="col-sm-9"
                   label="Default value"
                   help={this.state.defaultValueError ? this.state.defaultValueError :
                     'Give a default value if the parameter is not optional.'} />
            <Row>
              <Col smOffset={10}>
                <Button bsStyle="info" type="submit">Save</Button>
              </Col>
            </Row>
          </fieldset>
        </form></div>);
  }
}

export default ContentPackEditParameter;
