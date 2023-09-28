import React from 'react';
import { ApolloProvider, useQuery, gql } from '@apollo/client'; // Import ApolloProvider and useQuery
import client from './apollo'; // Import the Apollo Client instance
import TableView from './component/Tableview'; // Import your TableView component

const GET_DATA = gql`
{
  cards {
    id
    name
    category
    types
    stage
   
  }
}
`;
const App = () => {
  const { loading, error, data } = useQuery(GET_DATA ,{client});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  let tableData = data?.cards.slice(0,40); 
  console.log(tableData)
  // localStorage.setItem('pokemon' , JSON.stringify([tableData]))

localStorage.setItem('pokemon', JSON.stringify(tableData));
tableData = JSON.parse(localStorage.getItem('pokemon'));
console.log("tableData-------",tableData)
  return (
    <div className="App">
      <TableView/>
    </div>
  );
};

const AppWithApollo = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default AppWithApollo;