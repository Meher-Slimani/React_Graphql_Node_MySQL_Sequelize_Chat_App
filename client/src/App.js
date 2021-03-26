import "./App.scss";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import ApolloProvider from "./ApolloProvider";

import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";

import { AuthProvider } from "./context/auth";

const App = () => {
  return (
    <ApolloProvider>
      <AuthProvider>
        <Router>
          <Container className="pt-5">
            <Switch>
              <Route path="/register" component={Register} />
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
            </Switch>
          </Container>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
