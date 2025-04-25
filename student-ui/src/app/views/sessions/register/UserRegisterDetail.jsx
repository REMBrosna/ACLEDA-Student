import React from "react";
import Grid from "@material-ui/core/Grid";
import { useStyles } from "app/c1utils/styles";
import C1InputField from "app/c1component/C1InputField";
import { getValue } from "app/c1utils/utility";
import C1SelectField from "../../../c1component/C1SelectField";
import {MenuItem, OutlinedInput} from "@material-ui/core";
import C1DateField from "../../../c1component/C1DateField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

const UserRegisterDetail = ({
    inputData,
    isRegisterForm,
    handleDateChange,
    handleInputChange,
    errors,
    isSubmitting,
    newShowPassword,
    handleClickShowPasswordNew,
    handleMouseDownPassword,
    locale
}) => {
    console.log("errors",errors)

    const classes = useStyles();
    const dropdownOptionsJobType = [
        { value: "M", desc: "Male" },
        { value: "F", desc: "Female" },
    ];

    return (
        <Grid container alignItems="flex-start" spacing={3} className={classes.gridContainer}>
            <Grid item lg={4} md={6} xs={12} >
                <Grid container alignItems="center" spacing={3} className={classes.gridContainer}>
                    <Grid item xs={12} >
                        <C1InputField
                            label={locale("userDetails.username")}
                            name="username"
                            disabled={isRegisterForm}
                            required
                            inputProps={{
                                maxLength: 35,
                                placeholder: locale("userDetails.enterYourUsername")
                            }}
                            onChange={handleInputChange}
                            value={getValue(inputData?.username)}
                            error={errors && errors['username'] !== undefined}
                            helperText={(errors && errors['username']) || ''} />

                        <C1InputField
                            label={locale("userDetails.email")}
                            name="email"
                            disabled={isSubmitting}
                            required
                            inputProps={{
                                maxLength: 35,
                                placeholder: locale("userDetails.enterYourEmail")
                            }}
                            onChange={handleInputChange}
                            value={getValue(inputData?.email)}
                            error={errors && errors['email'] !== undefined}
                            helperText={(errors && errors['email']) || ''} />

                        <FormControl variant="outlined" fullWidth style={{marginTop : '15px'}}>
                            <InputLabel htmlFor="outlined-adornment-password">
                                {locale("userDetails.password")}</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={newShowPassword ? 'text' : 'password'}
                                value={inputData?.password || ""}
                                name="password"
                                onChange={handleInputChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPasswordNew}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {newShowPassword ? <VisibilityOff color="primary" /> : <Visibility color="primary" />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>

                    </Grid>
                </Grid>
            </Grid>

            <Grid item lg={4} md={6} xs={12} >
                <Grid container alignItems="center" spacing={3} className={classes.gridContainer}>
                    <Grid item xs={12}>
                        <C1InputField
                            label={locale("userDetails.firstName")}
                            name="firstname"
                            disabled={isSubmitting}
                            required
                            inputProps={{
                                placeholder: locale("userDetails.enterYourFirstName")
                            }}
                            onChange={handleInputChange}
                            value={getValue(inputData?.firstname)}
                            error={errors && errors['firstname'] !== undefined}
                            helperText={(errors && errors['firstname']) || ''} />
                        <C1SelectField
                            name="gender"
                            label={locale("user:user.details.gender")}
                            value={inputData?.gender ?? ""}
                            onChange={(e) => handleInputChange(e)}
                            disabled={false}
                            isServer={false}
                            required={true}
                            optionsMenuItemArr={dropdownOptionsJobType?.map((item, ind) => (
                                <MenuItem value={item.value} key={ind}>
                                    {item.desc}
                                </MenuItem>
                            ))}
                            // error={errors["stuGender"] !== undefined}
                            // helperText={errors["stuGender"] || ""}
                        />
                        <C1DateField
                            label={locale("user:user.details.dateOfBirth")}
                            name="dtOfBirth"
                            type="date"
                            disabled={false}
                            required
                            onChange={handleDateChange}
                            value={inputData?.dtOfBirth}
                            disablePast={true}
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item lg={4} md={6} xs={12} >
                <Grid container alignItems="center" spacing={3} className={classes.gridContainer}>
                    <Grid item xs={12} >
                        <C1InputField
                            label={locale("userDetails.lastName")}
                            name="lastname"
                            disabled={isSubmitting}
                            inputProps={{
                                placeholder: locale("userDetails.enterYourLastName")
                            }}
                            required
                            onChange={handleInputChange}
                            value={getValue(inputData?.lastname)}
                            error={errors && errors['lastname'] !== undefined}
                            helperText={(errors && errors['lastname']) || ''} />
                        <C1InputField
                            name="conNumber"
                            disabled={false}
                            type="number"
                            label={locale("user:user.details.conNumber")}
                            onChange={(e) => handleInputChange(e)}
                            value={inputData?.conNumber}
                            error={errors && errors['conNumber'] !== undefined}
                            helperText={(errors && errors['conNumber']) || ''}
                        />
                        <C1InputField
                            name="address"
                            disabled={false}
                            label={locale("user:user.details.address")}
                            onChange={(e) => handleInputChange(e)}
                            value={inputData?.address}
                            error={errors && errors['address'] !== undefined}
                            helperText={(errors && errors['address']) || ''}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
export default UserRegisterDetail;