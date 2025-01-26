import { getDatabase, onValue, ref, set } from "firebase/database";

// const firebaseConfig = {
//     apiKey: "AIzaSyBZHavEWbWJikh20WOZMLkWs2beoz_TPzE",
//     authDomain: "surplus-aed79.firebaseapp.com",
//     databaseURL: "https://surplus-aed79-default-rtdb.firebaseio.com",
//     projectId: "surplus-aed79",
//     storageBucket: "surplus-aed79.firebasestorage.app",
//     messagingSenderId: "992402453671",
//     appId: "1:992402453671:web:0e9b0a92bc9ce7167c5782",
//     measurementId: "G-3KJHKHQJXW"
// };

// const app = !getApps().length
//   ? initializeApp(firebaseConfig)
//   : getApp();

let username = "test";

export function changeUsername(changedUsername){
    username = changedUsername;
}
    
export function writeUserData(email, goal, budget,
    investmentPrefs, investments, finances){

    const db = getDatabase();
    const reference = ref(db, "users/" + username);

    set(reference, {
        email: email,
        goal: goal,
        budget: budget,
        investmentPrefs: investmentPrefs,
        investments: investments,
        finances: finances
    });
}

let email = "";
export function readEmail(username){
    const db = getDatabase();
    const reference = ref(db, "users/" + username);
    onValue(reference, (snapshot) => {
        const data = snapshot.val(); 
        console.log(data.email);
        email = data.email;
    });
    return email;
}
export function writeEmail(email){
    const db = getDatabase();
    const reference = ref(db, "users/" + username);
    set(reference, {
        email: email,
        goal: readGoal(username),
        budget: readBudget(username),
        investmentPrefs: readInvestmentPrefs(username),
        investments: readInvestments(username),
        finances: readFinances(username)
    });
}

let goal = "";
export function readGoal(username){
    const db = getDatabase();
    const reference = ref(db, "users/" + username);
    onValue(reference, (snapshot) => {
        const data = snapshot.val(); 
        console.log(data.goal);
        goal = data.goal;
    });
    return goal;
}

export function writeGoal(goal){
    const db = getDatabase();
    const reference = ref(db, "users/" + username);
    set(reference, {
        email: readEmail(username),
        goal: goal,
        budget: readBudget(username),
        investmentPrefs: readInvestmentPrefs(username),
        investments: readInvestments(username),
        finances: readFinances(username)
    });
}

let budget = "";
export function readBudget(username){
    const db = getDatabase();
    const reference = ref(db, "users/" + username);
    onValue(reference, (snapshot) => {
        const data = snapshot.val(); 
        console.log(data.budget);
        budget = data.budget;
    });
    return budget;
}

export function writeBudget(budget){
    const db = getDatabase();
    const reference = ref(db, "users/" + username);
    set(reference, {
        email: readEmail(username),
        goal: readGoal(username),
        budget: budget,
        investmentPrefs: readInvestmentPrefs(username),
        investments: readInvestments(username),
        finances: readFinances(username)
    });
}

let investmentPrefs = "";
export function readInvestmentPrefs(username){
    const db = getDatabase();
    const reference = ref(db, "users/" + username);
    onValue(reference, (snapshot) => {
        const data = snapshot.val(); 
        console.log(data.investmentPrefs);
        investmentPrefs = data.investmentPrefs;
    });
    return investmentPrefs;
}

export function writeInvestmentPrefs(investmentPrefs){
    const db = getDatabase();
    const reference = ref(db, "users/" + username);
    set(reference, {
        email: readEmail(username),
        goal: readGoal(username),
        budget: readBudget(username),
        investmentPrefs: investmentPrefs,
        investments: readInvestments(username),
        finances: readFinances(username)
    });
}

let investments = "";
export function readInvestments(username){
    const db = getDatabase();
    const reference = ref(db, "users/" + username);
    onValue(reference, (snapshot) => {
        const data = snapshot.val(); 
        console.log(data.investments);
        investments = data.investments;
    });
    return investments;
}

export function writeInvestments(investments){
    const db = getDatabase();
    const reference = ref(db, "users/" + username);
    set(reference, {
        email: readEmail(username),
        goal: readGoal(username),
        budget: readBudget(username),
        investmentPrefs: readInvestmentPrefs(username),
        investments: investments,
        finances: readFinances(username)
    });
}

let finances = "";
export function readFinances(username){
    const db = getDatabase();
    const reference = ref(db, "users/" + username);
    onValue(reference, (snapshot) => {
        const data = snapshot.val(); 
        finances = data.finances;
    });
    return finances;
}

export function writeFinances(finances){
    const db = getDatabase();
    const reference = ref(db, "users/" + username);
    set(reference, {
        email: readEmail(username),
        goal: readGoal(username),
        budget: readBudget(username),
        investmentPrefs: readInvestmentPrefs(username),
        investments: readInvestments(username),
        finances: finances
    });
}
