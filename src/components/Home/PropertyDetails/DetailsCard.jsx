import { Divider, Grid, makeStyles, Typography } from '@material-ui/core'
import { inject, observer } from 'mobx-react'
import React, { Fragment } from 'react'
import {
    Check as CheckIcon, 
    Close as CloseIcon
} from '@material-ui/icons'

const useStyles = makeStyles({
    cardTitle: {
        fontWeight: 'bold'
    },
    title: {
        marginBottom: '15px',
        marginTop: '10px',
        fontWeight: 'bold'
    },
    details: {
        marginBottom: '10px',
        height: 30
    },
    detail: {
        marginLeft: '5px',
        color: '#878787'
    }
})

const DetailsCard = inject('user')(observer((props) => {  

    const { user, property } = props

    const classes = useStyles()

    return (
        <Fragment>
            <Typography variant='h6' className={classes.cardTitle}>
                Details
            </Typography>
            <Grid item xs={12} container direction='row' >
                <Grid item xs={6} >
                    <Typography variant='subtitle1' className={classes.title}>
                        Property
                    </Typography>
                    <Grid item xs={12} container direction='row' className={classes.details}>
                        <Typography variant='subtitle2'>Rooms:</Typography>
                        <Typography variant='body2' className={classes.detail}>{property.rooms}</Typography>
                    </Grid>
                    <Grid item xs={12} container direction='row' className={classes.details}>
                        <Typography variant='subtitle2'>Bathrooms:</Typography>
                        <Typography variant='body2' className={classes.detail}>{property.bathrooms}</Typography>
                    </Grid>
                    <Grid item xs={12} container direction='row' className={classes.details}>
                        <Typography variant='subtitle2'>Maximum guests:</Typography>
                        <Typography variant='body2' className={classes.detail}>{property.guests}</Typography>
                    </Grid>
                    <Grid item xs={12} container direction='row' className={classes.details}>
                        <Typography variant='subtitle2'>Pool:</Typography>
                        <Typography variant='body2' className={classes.detail}>
                            {property.pool ? <CheckIcon /> : <CloseIcon />}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} container direction='row' className={classes.details}>
                        <Typography variant='subtitle2'>Kitchen:</Typography>
                        <Typography variant='body2' className={classes.detail}>
                            {property.kitchen ? <CheckIcon /> : <CloseIcon />}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} container direction='row' className={classes.details}>
                        <Typography variant='subtitle2'>AC:</Typography>
                        <Typography variant='body2' className={classes.detail}>
                            {property.ac ? <CheckIcon /> : <CloseIcon />}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} container direction='row' className={classes.details}>
                        <Typography variant='subtitle2'>Wifi:</Typography>
                        <Typography variant='body2' className={classes.detail}>
                            {property.wifi ? <CheckIcon /> : <CloseIcon />}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={6} >
                    <Typography variant='subtitle1' className={classes.title}>
                        Owner
                    </Typography>
                    <Grid item xs={12} container direction='row' className={classes.details}>
                        <Typography variant='subtitle2'>Name:</Typography>
                        <Typography variant='body2' className={classes.detail}>{property.owner.name}</Typography>
                    </Grid>
                    <Grid item xs={12} container direction='row' className={classes.details}>
                        <Typography variant='subtitle2'>Phone:</Typography>
                        <Typography variant='body2' className={classes.detail}>{property.owner.phone}</Typography>
                    </Grid>
                    <Grid item xs={12} container direction='row' className={classes.details}>
                        <Typography variant='subtitle2'>Email:</Typography>
                        <Typography variant='body2' className={classes.detail}>{property.owner.email}</Typography>
                    </Grid>
                    <Grid item xs={12} container direction='row' className={classes.details}>
                        <Typography variant='subtitle2'>Country:</Typography>
                        <Typography variant='body2' className={classes.detail}>{property.owner.country}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Fragment>
    )
}))

export default DetailsCard