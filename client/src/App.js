import "./App.scss";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import ApolloProvider from "./ApolloProvider";

import Register from "./pages/Register";

const App = () => {
  return (
    <ApolloProvider>
      <Router>
        <Container className="pt-5">
          <Route path="/register" component={Register} />
        </Container>
      </Router>
    </ApolloProvider>
  );
};

export default App;
