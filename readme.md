Folders contain Load Test, Spike Test, and Stress Test for task 3.

CRUD TASK Description
In the CRUDTests folder are 4 folders called LOAD, SOAK, SPIKE, STRESS. Inside these are .jmx files for each along with their reports.

These tests are currently only for LISTS in my To-Do List Project.

The only test that has a substantial amount of errors/fails is the soak test, with 16.21% FAIL in the summary. This was larger (almost 50%) before adding a timer between http requests to avoid address already in use error, but it still remained.

