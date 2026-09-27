import React from 'react';
import ValueProperty from '../Pages/ValueProperty';
import Privacity from '../Pages/Privacity';
import TermsAndConditions from '../Pages/TermsAndConditions';
import Property from '../Pages/Property';
import Properties from '../Pages/Properties';
import { Navbar, Footer } from '@/Components';
import { history } from '../Helpers/history';
import 'tailwindcss/tailwind.css';
import {
    HashRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

const App = () => {
    return (
        <Router history={history}>
            <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-500 selection:text-white">
                <Navbar />
                <main className="flex-1 flex flex-col">
                    <Switch>
                        <Route exact path="/" component={ValueProperty} />
                        <Route exact path="/properties" component={Properties} />
                        <Route exact path="/details" component={Property} />
                        <Route exact path="/privacity" component={Privacity} />
                        <Route exact path="/terms" component={TermsAndConditions} />
                    </Switch>
                </main>
                <Route
                    render={({ location }) =>
                        location.pathname !== '/' ? <Footer /> : null
                    }
                />
            </div>
        </Router>
    );
};

export default App;
