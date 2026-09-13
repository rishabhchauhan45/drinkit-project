"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complianceService = exports.stateLaws = void 0;
exports.stateLaws = {
    Maharashtra: { allowed: true, minAge: 25, timing: { start: '10:00', end: '22:00' }, licenseRequired: true, notes: ['Delivery only through licensed vendors', 'ID verification mandatory'] },
    Karnataka: { allowed: true, minAge: 21, timing: { start: '09:00', end: '23:00' }, licenseRequired: true, notes: ['Valid ID required', 'No delivery in dry zones'] },
    Delhi: { allowed: true, minAge: 25, timing: { start: '10:00', end: '22:00' }, licenseRequired: true, notes: ['L-6 license required', 'Age verification mandatory'] },
    Goa: { allowed: true, minAge: 21, timing: { start: '08:00', end: '00:00' }, licenseRequired: true, notes: ['Tourist friendly'] },
    Gujarat: { allowed: false, minAge: 25, timing: { start: '00:00', end: '00:00' }, licenseRequired: false, notes: ['Complete prohibition state'] }
};
exports.complianceService = {
    getStateLaw(state) { return exports.stateLaws[state] || null; },
    isAlcoholAllowed(state) { const law = this.getStateLaw(state); return law ? law.allowed : false; },
    getMinAge(state) { const law = this.getStateLaw(state); return law ? law.minAge : 21; },
    canDeliverNow(state) {
        const law = this.getStateLaw(state);
        if (!law || !law.allowed)
            return false;
        const now = new Date();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        const [startHour, startMin] = law.timing.start.split(':').map(Number);
        const [endHour, endMin] = law.timing.end.split(':').map(Number);
        const startTime = startHour * 100 + startMin;
        const endTime = endHour * 100 + endMin;
        return currentTime >= startTime && currentTime <= endTime;
    },
    validateAge(age, state) { return age >= this.getMinAge(state); }
};
