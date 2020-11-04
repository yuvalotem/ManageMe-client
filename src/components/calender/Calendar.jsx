import { Grid, makeStyles, Typography, MenuItem } from '@material-ui/core'
import { inject, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  AppointmentForm,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
  EditRecurrenceMenu,
  AppointmentTooltip,
  ConfirmationDialog
} from '@devexpress/dx-react-scheduler-material-ui';
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  cardDetails: {
    marginTop: '15px'
  },
  calendarContainer: {
    maxWidth: '90%',
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: 100,
      maxWidth: '90%',
      height: 600
    }
  }
}))

const TextEditor = (props) => {
  if (props.type === 'multilineTextEditor') {
    return null;
  } return <AppointmentForm.TextEditor {...props} />;
};

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }, user) => {
  const usercopy = {...user}
  const onCustomFieldChange = (e) => {
    const key = e.target.name
    onFieldChange({ [key]: e.target.value });
  };

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    >
      <AppointmentForm.Label
        text="Name"
        type="title"
      />
      <AppointmentForm.TextEditor
        value={appointmentData.name}
        name="name"
        key="name"
        onChange={onCustomFieldChange}
        placeholder="Custom field"
      />
      {appointmentData.channel ? <>
      <AppointmentForm.Label
        text="Number of guests"
        type="title"
      />
      <AppointmentForm.TextEditor
        value={appointmentData.guests}
        name="guests"
        key="guests"
        onChange={onCustomFieldChange}
        placeholder="Guests"
      />
      <AppointmentForm.Label
        text="Channel"
        type="title"
      />
      <AppointmentForm.TextEditor
        value={appointmentData.channel}
        name="channel"
        key="channel"
        onChange={onCustomFieldChange}
        placeholder="Channel"
      />
      </> : null}
      <AppointmentForm.Label
        text="Property"
        type="title"
      />
      <AppointmentForm.TextEditor
        value={appointmentData.property}
        select
        name="property"
        key="property"
        onChange={onCustomFieldChange}
        placeholder="Property"
      >
        {usercopy.properties.map(p => {
          return (<MenuItem key={p.id} value={p.id}>
            {p.name}
          </MenuItem>)
        })}
        </AppointmentForm.TextEditor>
      <AppointmentForm.Label
        text="Phone"
        type="title"
      />
      <AppointmentForm.TextEditor
        value={appointmentData.phone}
        name='phone'
        key='phone'
        onChange={onCustomFieldChange}
        placeholder="Phone"
      />
      <AppointmentForm.Label
        text="Email"
        type="title"
      />
      <AppointmentForm.TextEditor
        value={appointmentData.email}
        name='email'
        key='email'
        onChange={onCustomFieldChange}
        placeholder="Email"
      />
    </AppointmentForm.BasicLayout>
  );
};

const Calendar = inject('user')(observer((props) => {
  const { user } = props
  const classes = useStyles()
  const [booking, setBooking] = useState([])
  const [addedAppointment, setAddedAppointment] = useState({})
  const [appointmentChanges, setAppointmentChanges] = useState({})
  const [editingAppointment, setEditingAppointment] = useState(undefined)

  useEffect(() => {
    const newBooking = []
    user.properties.forEach(p => {
      p.booking.forEach(b => {
        if(b.channel){
        newBooking.push({
          title: "Booking",
          ...b
        })
      }else{
        newBooking.push({
          title: "Mission",
          ...b
        })
      }
      })
    })
    setBooking(newBooking)
  }, [])

  const messages = {
    moreInformationLabel: '',
  };


  async function commitChanges({ added, changed, deleted }) {
      if (added) {
        added.startDate = moment(added.startDate).format('YYYY/MM/DD HH:mm:ss')
        added.endDate = moment(added.endDate).format('YYYY/MM/DD HH:mm:ss')
        // console.log(added);
        added.id = await user.addNewBooking(added)
        setBooking([...booking,  added ]);
      }
      if (changed) {
        let id
        const newBooking = booking.map(appointment => {
          if(changed[appointment.id]){
            id = appointment.id
            return { ...appointment, ...changed[appointment.id] }
           }
           return  appointment
          });
          setBooking(newBooking)
          const bookingToDB = {}
          for(let key in changed[id]){
            const newKey = key === 'startDate' ? 'start_date' : key === 'endDate' ? "end_date" : key
            if(key !== 'allDay' && key !== 'title'){
              changed[id][key] = newKey === 'start_date' || newKey === 'end_date' ? moment(changed[id][key]).format('YYYY/MM/DD HH:mm:ss') : changed[id][key]
              bookingToDB[newKey] = changed[id][key]
            }
          }
          user.updateBooking(id, bookingToDB);
      }
      if (deleted !== undefined) {
        user.deleteBooking(deleted)
        const newBooking = booking.filter(appointment => appointment.id !== deleted);
        setBooking(newBooking)
      }
      return { booking };
  }

  return (
    <Grid
      item
      xs={12}
      className={classes.cardDetails}>

      <Grid
        container
        item
        xs={12}
        justify="center">
        <Typography variant='h5'>
          All properties Schedule
        </Typography>
  </Grid>

      <Paper className={classes.calendarContainer}>

        <Scheduler
          data={booking}
          height='100%'
        >
          <ViewState
            defaultCurrentDate={Date.now()}
          />

          <EditingState
            onCommitChanges={commitChanges}

            addedAppointment={addedAppointment}
            onAddedAppointmentChange={(addedAppointment)=> setAddedAppointment(addedAppointment)}

            appointmentChanges={appointmentChanges}
            onAppointmentChangesChange={(appointmentChanges)=> setAppointmentChanges(appointmentChanges)}

            editingAppointment={editingAppointment}
            onEditingAppointmentChange={(editingAppointment)=> setEditingAppointment(editingAppointment)}
          />

          <MonthView />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <EditRecurrenceMenu />
          <ConfirmationDialog />
          <Appointments />
          <AppointmentTooltip
            showOpenButton
            showDeleteButton
          />
        <AppointmentForm
        basicLayoutComponent={(e) => BasicLayout(e, user)}
        textEditorComponent={TextEditor}
        messages={messages}
        />
        </Scheduler>
      </Paper>
    </Grid >
  )
}))
export default Calendar