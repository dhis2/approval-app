Feature: Users can view data set reports for data sets connected to a workflow

    Background:
        Given the admin user visits the app
        Then the user has workflow "Mortality < 5 years" preselected
        When the user selects period "March" of current year

    Scenario: User views approvable data
        When the user selects organisation unit "Badjia"
        Then the status tag shows the approval status "Ready for approval"
        Then a tab bar is displayed with a single tab "Mortality < 5 years"
        And a single table with data is displayed

    Scenario: User views unapprovable data
        When the user selects organisation unit "Sierra Leone"
        Then the status tag shows the approval status "Cannot be approved"
        Then a tab bar is displayed with a single tab "Mortality < 5 years"
        And a single table with data is displayed

    Scenario: User views data waiting for lower level approval
        When the user selects organisation unit "Bo"
        Then the status tag shows the approval status "Waiting for lower level approval"
        Then a tab bar is displayed with a single tab "Mortality < 5 years"
        And a single table with data is displayed

    Scenario: User views data waiting for higher level approval
        When the user selects organisation unit "Baoma Station CHP"
        Then the status tag shows the approval status "Waiting for higher level approval"
        Then a tab bar is displayed with a single tab "Mortality < 5 years"
        And a single table with data is displayed