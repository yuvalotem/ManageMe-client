import { Grid, makeStyles } from '@material-ui/core'
import { Auth } from 'aws-amplify'
import { inject, observer } from 'mobx-react'
import React, { Fragment } from 'react'
import { useHistory, BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Calendar from '../calender/Calendar'
import Properties from '../Home/Properties'
import Menu from './Menu'
import Calendar from '../Calendar/Calendar'
import Profile from '../settings/Profile'

const useStyles = makeStyles((theme) => ({
    homeContainer: {
        height: '100%',
        padding: '20px',
        [theme.breakpoints.up('sm')]: {
            marginLeft: 160,
            paddingTop: '40px',
            padding: '30px',
        },
    },
    container: {
        height: '91vh'
    }
}))

const Container = inject('user')(observer((props) => {

    const classes = useStyles()

    const history = useHistory()

    const { user } = props

    async function handleLogout() {
        await Auth.signOut()
        user.userHasAuthenticated(false)
        history.push('/login')
    }

    return (
        <Router>
       
            <Grid item xs={12} container className={classes.container}>
                <Menu handleLogout={handleLogout} />
                <Redirect from='/home' to='/home/properties' />
                <Grid 
                    item 
                    xs={12} 
                    container 
                    className={classes.homeContainer} 
                >
                    <Route 
                        path='/home/properties' 
                        exact render={({ match }) => 
                            <Properties 
                                match={match} 
                            />
                        }
                    />
                    <Route 
                        path='/home/properties/:propertyId' 
                        exact render={({ match }) => 
                            <Properties 
                                match={match} 
                            />
                        }
                    />
                    <Route 
                    path='/calendar' 
                    exact render={({ match }) => 
                        <Calendar 
                            match={match} 
                        />
                    }
                />
                  
                  <Route 
                    path='/profile'
                    exact render={() => <Profile />} />
                </Grid>

            </Grid>
        </Router>
    )

}))

export default Container