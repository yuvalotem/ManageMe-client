import {
    makeObservable,
    observable,
    action,
    isAction,
} from 'mobx';
import Todo from '../Stores/Todo'
import Property from '../Stores/Property'
import ServiceWorkers from '../Stores/ServiceWorkers'
import Booking from '../Stores/Booking'
import UserService from '../Services/UserService'

export default class User {

    constructor() {
        this.isAuthenticated = false
        this.id = ''
        this.img = ''
        this.firstName = ''
        this.lastName = ''
        this.email = ''
        this.phone = ''
        this.dateJoin = ''
        this.type = null
        this.properties = []
        this.serviceWorkers = []

        makeObservable(this, {
            isAuthenticated: observable,
            id: observable,
            img: observable,
            firstName: observable,
            lastName: observable,
            email: observable,
            phone: observable,
            dateJoin: observable,
            properties: observable,
            serviceWorkers: observable,
            userHasAuthenticated: action,
            loadUserDetails: action,
            loadUserProperties: action,
            loadProperteisTodos: action,
            loadPropertiesWorkers: action,
            loadUserTypes: action,
            loadUserServiceProviders: action,
            addNewUserType: action,
            addNewProperty: action,
            addNewTodo: action,
            updateUserDetails: action,
            updatePropertyDetails: action,
            updateTodoDetails: action,
            updateTodoStatus: action,
            deleteProperty: action,
            deleteTodo: action,
            deleteServiceWorkerFromProperty: action,
            deleteServiceWorkerFromUser: action
        })
    }

    userHasAuthenticated = async (email = undefined, bool) => {
        try {
            this.isAuthenticated = bool
            if (this.isAuthenticated && email) {
                await this.loadUserDetails(email)
                await this.loadUserServiceProviders()
                await this.loadUserProperties()
                await this.loadPropertiesWorkers()
                await this.loadProperteisTodos()
                await this.loadProperteisBooking()
                console.log(this);
            }
            else {
                this.isAuthenticated = false
                this.id = ''
                this.img = ''
                this.firstName = ''
                this.lastName = ''
                this.email = ''
                this.phone = ''
                this.dateJoin = ''
                this.type = null
                this.properties = []
            }
        } catch (error) {
            console.log(error);
        }
    }

    loadUserDetails = async (email) => {
        const user = await UserService().getUserDetails(email)
        this.id = user.id
        this.img = user.img
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.email = user.email
        this.phone = user.phone
        this.dateJoin = user.dateJoin
        this.type = {
           type: user.type,
            id: user.typeId
        }
    };

    loadUserProperties = async () => {
        this.properties = []
        const userProperties = await UserService().getUserProperties(this.id)
        for(let property of userProperties) {
            this.properties.push(new Property(property))
        }
    };

    loadPropertiesWorkers = async () => {
        for(let property of this.properties) {
            let serviceList = await UserService().getPropertyServiceProviders(property.id)
            if(serviceList.length > 0) {
                serviceList.forEach(servicer => {
                    property.serviceWorkers.push(new ServiceWorkers(servicer))
                })
            }
        }
    }

    loadProperteisTodos = async () => {
        for (let property of this.properties) {
            let todoList = await UserService().getPropertyTodo(property.id)
            todoList.forEach(todo => {
                property.todoList.push(new Todo(todo))
            })
        }
    };

    loadProperteisBooking = async () => {
        for (let property of this.properties) {
            let bookingList = await UserService().getBooking(property.id)
            bookingList.forEach(booking => {
                property.booking.push(new Booking(booking))
            })
        }
    };

    loadUserServiceProviders = async () => {
        const allEmployees = await UserService().getUserServiceProviders(this.id)
        for(let employee of allEmployees) {
            const serviceWorker = new ServiceWorkers(employee)
            this.serviceWorkers.push(serviceWorker)
        }
    };

    loadUserTypes = async (id = undefined) => {
        const allTypes = await UserService().getUserTypes(id)
        return allTypes
    };

    addNewUserType = async (type) => {
        const newType = await UserService().addNewUserType(type)
        return newType
    };

    addNewProperty = async (property) => {
        if (this.type === 1) {
            const propertyDetails = { manager: this.id, ...property }
            await UserService().addNewProperty(propertyDetails)
            this.properties.push(new Property(property))
        }
        else {
            console.log('You dont have prommision')
        }
    };

    addNewTodo = async (propertyId, todoDetails) => {
        if (this.type === 'Manager') {
            const property = this.properties.find(p => p.id === propertyId)
            const todo = { property: propertyId, img: '', ...todoDetails }
            todo.id = await UserService().addNewTodo(todo)
            property.todoList.push(new Todo(todo))
        }
        else {
            console.log('You dont have prommision');
        }
    };

    addNewManagerEmployee = async (servicerDetails) => {
        if (this.type === 'Manager') {
            const serviceWorker = await UserService().addNewServiceWorker(servicerDetails)
            this.serviceWorkers.push(new ServiceWorkers(serviceWorker))
        }
        else {
            console.log('You dont have prommision');
        }
    };

    addNewServiceProperty = async (propertyId, employeeId) => {
        await UserService().addPropertyServiceWorker(propertyId, employeeId)
    }

    addNewBooking = async (propertyId, bookingDetails) => {
        if (this.type === 1) {
            const property = this.properties.find(p => p.id === propertyId)
            const newBooking = { property: property.id, ...bookingDetails }
            newBooking.id = await UserService().addNewBooking(newBooking)
            property.serviceWorkers.push(new Booking(newBooking))
        }
        else {
            console.log('You dont have prommision');
        }
    };

    updateUserDetails = async (userDetails) => {
        await UserService().updateUserDetails(this.id, userDetails);
        for (let prop in userDetails) {
            const key = prop === 'first_name' ? "firstName" : prop === 'last_name' ? "lastName" : prop
            this[key] = userDetails[prop]
        }
    };

    updatePropertyDetails = async (propertyId, updateDetails) => {
        if (this.type === 1) {
            const property = this.properties.find(p => p.id === propertyId)
            await UserService().updateProperty(property.id, updateDetails)
            for (let prop in updateDetails) {
                property[prop] = updateDetails[prop]
            }
        }
        else {
            console.log('You dont have prommision');
        }
    };

    updateTodoDetails = async (propertyId, todoId, todoDetails) => {
        const property = this.properties.find(p => p.id === propertyId)
        const todo = property.todoList.find(td => td.id === todoId)
        if (this.type === 1) {
            await UserService.updateTodoDetails(todo.id, todoDetails)
            for (let td in todoDetails) {
                todo[td] = todoDetails[td]
            }
        }
    };

    updateTodoStatus = async (propertyId, todoId) => {
        const property = this.properties.find(p => p.id === propertyId)
        const todo = property.todoList.find(td => td.id === todoId)
        todo.complete = !todo.complete
        await UserService().updateTodoStatus(todo.id, todo.complete)
    };

    updateBooking = async (propertyId, bookingId, bookingDetails) => {
        const property = this.properties.find(p => p.id === propertyId)
        const booking = property.booking.find(b => b.id === bookingId)
        if (this.type === 1) {
            await UserService.updateBookingDetails(bookingId, bookingDetails)
            for (let b in bookingDetails) {
                booking[b] = bookingDetails[b]
            }
        }
    };

    deleteProperty = async (propertyId) => {
        if (this.type === 1) {
            const propertyIndex = this.properties.findIndex(p => p.id === propertyId)
            this.properties.splice(propertyIndex, 1)
            await UserService.deleteProperty(propertyId)
        }
        else {
            console.log('You dont have prommision');
        }
    };

    deleteTodo = async (propertyId, todoId) => {
        if (this.type === 'manager') {
            const property = this.properties.find(p => p.id === propertyId)
            const todoIndex = property.todoList.findIndex(td => td.id === todoId)
            property.todoList.splice(todoIndex, 1)
            await UserService().deleteTodo(todoId);
        }
        else {
            console.log('You dont have prommision');
        }
    };

    deleteServiceWorkerFromProperty = async (propertyId, ServiceWorkerId) => {
        if (this.type === 'manager') {
            await UserService().deleteServiceWorkers(propertyId, ServiceWorkerId);
            const property = this.properties.find(p => p.id === propertyId)
            const serviceWorkerIndex = property.serviceWorkers.findIndex(sw => sw.id === ServiceWorkerId)
            property.serviceWorkers.splice(serviceWorkerIndex, 1)
        }
        else {
            console.log('You dont have prommision');
        }
    };

    deleteServiceWorkerFromUser = async (ServiceWorkerId) => {
        if (this.type === 'manager') {
            for(let property of this.properties) {
                const serviceWorker = property.serviceWorkers.findIndex(sw => sw.id === ServiceWorkerId)
                if(serviceWorker >= 0) {
                    alert('This servive worker is connected to one of your properties. You must detlete it first.')
                }
            }
            await UserService().deleteServiceWorkerFromUser(this.id, ServiceWorkerId)
        }
        else {
            console.log('You dont have prommision');
        }
    };

    deleteBooking = async (propertyId, BookingId) => {
        if (this.type === 1) {
            await UserService().deleteBooking(BookingId);
            const property = this.properties.find(p => p.id === propertyId)
            const bookingIndex = property.booking.findIndex(b=> b.id === BookingId)
            property.booking.splice(bookingIndex, 1)
        }
        else {
            console.log('You dont have prommision');
        }
    };
};








