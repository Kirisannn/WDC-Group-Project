/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */


const members = [
	{
		id: 1,
		givenName: 'John',
		familyName: 'Doe',
		role: 'Manager'
	},
	{
		id: 2,
		givenName: 'Jane',
		familyName: 'Doe',
		role: 'Member'
	},
	{
		id: 3,
		givenName: 'Jim',
		familyName: 'Doe',
		role: 'Manager'
	}
];

// eslint-disable-next-line no-undef
const manageUsers = new Vue({
	el: '#users',
	data: {
		users: members,
		searchQuery: ''
	},
	computed: {
		filteredUsers() {
			return this.users.filter((user) => {
				const name = `${user.givenName} ${user.familyName}`.toLowerCase();
				return name.includes(this.searchQuery.toLowerCase());
			});
		}
	}
});
