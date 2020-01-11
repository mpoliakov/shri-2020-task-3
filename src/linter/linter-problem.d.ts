import Location from './bem/location';
export default interface LinterProblem {
    code: string;
    error: string;
    location: Location;
}
