import Application from '../src/app';
import path from 'path';
import fs from 'fs';
import { describe, it, before, after, beforeEach, afterEach } from 'mocha';

const infra = Application.instance();
///////////////////////////////////////////////////////////////////////////////
globalThis.TestCache = { };

//Set-up
before(async () => {
    console.log('Set-up: Initializing test set-up!');
    initializeCache();
    console.log(globalThis.TestCache);
    await infra.start();
});

//Tear-down
after(() => {
    // var server = infra.server;
    // server.close(() => {
    console.info('Tear-down: Server shut down successfully!');
    // });
});

function loadTestData() {
    var filepath = path.join(process.cwd(), 'tests', 'test.data.json');
    var fileBuffer = fs.readFileSync(filepath, 'utf8');
    const obj = JSON.parse(fileBuffer);
    return obj;
}

function initializeCache() {
    const testData = loadTestData();
    globalThis.TestCache = testData;
}
