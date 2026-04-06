# setup virtual envitroment (terminal)
python3 -m venv venv

# activate virtual environment  (new terminal)
(macOS/linux)
source venv/bin/activate

(windows)
venv\Scripts\activate

# should see (venv) in the terminal , example:
(venv) jane@Janes-MacBook-Pro vs-test-miniWall % source venv/bin/activate>

# install request library to handle the HTTP requests
pip install requests

# to run the test file(terminal)
python3 <filename>

python3 api_run_test.py