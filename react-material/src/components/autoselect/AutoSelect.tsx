import * as React from 'react';
import classNames from 'classnames';
//@ts-ignore
import {Async} from 'react-select';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import {emphasize} from '@material-ui/core/styles/colorManipulator';
import {Button} from "@material-ui/core";


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            <Button type={"button"} fullWidth>Add Category</Button>
        </Typography>
    );
}

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function SingleValue(props) {
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={classNames(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    );
}

function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};

class AutoSelect extends React.Component<AutoSelectProps, AutoSelectState> {
    state = {
        single: null,
        multi: null,
    };

    handleChange = name => value => {
        if (this.props.onChange) {
            this.props.onChange(this.props.name, value);
        }
        this.setState({
            [name]: value,
        });
    };

    componentWillMount(): void {
        if (this.props.defaultValue) {
            const obj = [] as any;
            const def = this.props.defaultValue;
            const val = def.map(val => {
                return {
                    label: val,
                    value: val
                }
            });
            obj.push(...val);
            //obj.push(this.props.defaultValue.map((c:string) => ({label: c, value: c})));
            this.setState({multi: obj});
        }
    }

    componentDidUpdate(prevProps: Readonly<AutoSelectProps>, prevState: Readonly<AutoSelectState>, snapshot?: any): void {
        console.log(this.state);
        console.log(this.props);
    }

    render() {
        // @ts-ignore
        const { classes, theme } = this.props;

        const selectStyles = {
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
                '& input': {
                    font: 'inherit',
                },
            }),
        };

        // @ts-ignore
        const selectProps = {
            classes,
            styles: selectStyles,
            textFieldProps: {
                label: this.props.label || "Label",
                InputLabelProps: {
                    shrink: true,
                },
            },
            options: this.props.options || [],
            components, value: this.state.multi,
            onChange: this.handleChange('multi'),
            placeholder: this.props.placeholder || "",
            isMulti: true,
            isSearchable: true,
            name: this.props.name || ""
        };

        const asyncProps = {
            cacheOptions: true, isMulti: true, isSearchable: true,
            defaultOptions: true,
            name: this.props.name || "",
            options: this.props.options || [],
            components, classes, styles: selectStyles,
            onChange: this.handleChange('multi'),
            textFieldProps: {
                label: this.props.label || "Label",
                InputLabelProps: {
                    shrink: true,
                },
            },
            loadOptions: this.props.values || undefined
        };

        return (
            <div className={classes.root}>
                <NoSsr>
                    <Async {...asyncProps} />
                </NoSsr>
            </div>
        );
    }
}


interface AutoSelectProps {
    state?: AutoSelectState;
    classes?: any;
    theme?: any;
    label?: string;
    placeholder?: string;
    options?: Array<{
        label: string;
        value: string;
    }>;
    values: (value, callback) => any;
    onChange: (name, value) => void;
    name?: string;
    defaultValue?: string[];
}

interface AutoSelectState {

}

// @ts-ignore
export default withStyles(styles, { withTheme: true })(AutoSelect);