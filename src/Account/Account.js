import React, { Component } from 'react'
import CreateModifyDeleteUser from '../Users/CreateModifyDeleteUser'
import user from '../Services/User'

class Account extends Component {
    
    state = {
        user: null
    }

    componentDidMount = () =>{
        user.user().then((u) =>{
            console.log('hi')
            console.log(u)
            this.setState({
                user: u
            })
        })
    }

    render(){
        return(
            <div>
                {this.state.user &&
                <CreateModifyDeleteUser
                    showTable_f = {null} 
                    user = {this.state.user} 
                    mode = "existing" 
                    refreshUsers ={() => {}
                    }
                />
                }
            </div>
            

        )
    }
}

export default Account;