Built with SST and NodeJS 16

To build the stack in your AWS environment, run `npm run start` from the project root

The AWS CLI can be used to send task token success/failure notifications to Step Functions for testing

Example commands:

`aws stepfunctions send-task-success --task-token AQCMAAAAKgAAAAMAAAAAAAAAAXJMnc5/IQM1JGQmMdyPiX7HmPEEvIBn3POgcY19+17ZfIunXVtf+Mo4cEDngasWkiXg8QSFzGDM9TnbEqjXTtXYoBRTyX5K7JBXBGl2evWFkdPcZPsWF9UhB/3F734OMgWUGKxb8K51ef3Tsk+jRbp7gskBEDWLT6sMNjOHxaAYxY3NhWz9zt197DTQ5AY5+6t/3/qvxxZehjfRMgeZXbPn6wmdNLVSyE25EuTCUzkqMf3G8Gn4Ik1umEIzX/86P2Wa5TfN1M0A4JGxEAYY+LqbqQbE+8PZ8XtDMTUUWMZI218nQ6+YafqBi5oaWhKi/ZajWFlWtr4lQefAs/4Cj+dr+VLCu8S+YDw9hETriuZ8HNnN2mGx4CoHXcBRvbADW+wfg9mkLY2H7z1BqTVn6HrEz14CXp2qyCjOO10ccE5ri3Rqx2kzxEXDat5AN6aIeXQUoIep84ztrysDf1S5CwVDC5mpFPt4BwWD5lRk5Al+3DUa4237opeg6C0htMfSpC+tONwy2gvBbOhMwopqxMhFC8uBo8Be7Fp6VzGBBJJ0OGKX+aWflBsF56ETYp83+lipJZ3/nKUet672e6MkfBVB/fA+n7VxAdk39JuouHY4lqzdBQ4eBS6yzGJYzaVnl+WWijTASaTb --task-output '{"joboutput": "video job output"}'`

`aws stepfunctions send-task-failure --task-token AQCMAAAAKgAAAAMAAAAAAAAAAVTqKanY7RRdoDBSKUd8yF1zpF3BajyLMabrX+5Vf/irUrLCCxFzkgwJdPHn6IU4p8maJLzWyxT+YHoQH1xEWDHczItg/hrdcu/q2xUhZCT3LG5H7FBhBpcEc0qe3/8jFnYW0rQDR/DgNAA0jqF8fY0B5v699ILyJL0UHEF5eT+rZyMqzb9VvjjmjBtJYa1S1/kUAE4zpv3o+ZUM1vSQJa+igPz8ZZCMhmiGhafVrxtrm+dfmQEYzQHZrPX4CE7mTh/svf6YwE1jP6ePhB0+n3r1/24aNDjW6VPeWbYX+F45kVVpYiWlgP9LApH4lD11y9FKBoSid+0EHGKGLByTQ2xsgXw7Q29kDrcEC2Q1ZloFsuh3o4UOO5UozMNxoHg+ksvd0YTgHxzAto8r3YVoEeNIiWJOnUHJ/2balHZWcwUB13TDKGo7wINotD2iWJkTY6qJgxNAfbTzHbN7xy9Fm5+yQjw/lcsl7F1ySgvyIvX7znwjwYES7dOC/Z478MfRPWBtBqjki8SEKwPQl7Nat9cl531+z3UfEpptRHO5MI+mC66VGG8r54GjoDdUx0YiAepMi6fnPUVqrGSRC/3K4amclGWHQ1UyaJsdm2HnK9JNwUaIwpKi7FdiQc2+yWpMfhgC9VtDbvVE --error "MC Job Failed" --cause "Bad file"`

Usage:

1. Execute the state machine included in the stack with any input
2. Two tasks will be waiting for results
3. Start MC jobs with userMetadata of `jobId: job1` or `jobId: job2`
4. The success/failure should be reported back to the state machine and execution should continue.

Note: the execution will fail if both jobs don't receive a report within the 5 minute timeout.
