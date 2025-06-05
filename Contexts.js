function Cartesian_Product(Sets) {
    if (Sets.length > 1) {
        let Output = []
        for (let I of Cartesian_Product(Sets.slice(1))) {
            for (let J of Sets[0]) {
                Output.push([J, ...I])
            }
        }
        return Output
    } else {
        return Sets.length == 0 ? [] : Sets[0].map(X => [X])
    }
}

function Initial_Numbers(N) {
    let Output = []
    for (let I = 0; I < N; I++) Output.push(I)
    return Output
}

function Generate(States, Entities, Time, Rules) {
    let Omega = [[]]
    let Gamma = Cartesian_Product(Initial_Numbers(Entities).map(_ => States))
    while (Omega[0].length < Time) {
        let Alpha = []
        for (let O of Omega) for (let G of Gamma) Alpha.push([...O, G])
        Omega = Alpha
    }
    return Omega.filter(Instance => Rules(Instance))
}

function Generate_Determinable_Context(Starting_States, Time, Iterator) {
    let Omega = Starting_States.map(X => [X])
    while (Omega[0].length < Time) {
        let Alpha = []
        for (let O of Omega) Alpha.push(...Iterator(O.at(-1)).map(X => [...O, X]))
        Omega = Alpha
    }
    return Omega
}

let S = Initial_Numbers(2)

let E = 2

let T = 5

let Start = S.map(V => [V, V])

let Standard_Map = {}
let Determinable_Map = {}

let Runs = 1000

for (let Run = 0; Run < Runs; Run++) for (let Time = 2; Time <= T; Time++) {
    let Measuring_Time = performance.now()
    let A = Generate(S, E, Time, X => Initial_Numbers(Time).every(Tau => X[Tau][0] == X[Tau][1]))
    let Standard_Time = performance.now() - Measuring_Time
    Measuring_Time = performance.now()
    let B = Generate_Determinable_Context(Start, Time, _ => Start)
    let Determinable_Time = performance.now() - Measuring_Time
    Standard_Map[Time] = (Standard_Map[Time] ?? 0) + Standard_Time / Runs
    Determinable_Map[Time] = (Determinable_Map[Time] ?? 0) + Determinable_Time / Runs
}
console.log(Standard_Map)
console.log(Determinable_Map)