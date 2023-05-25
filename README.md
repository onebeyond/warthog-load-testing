:warning: This project is still under development :warning:

__*Warthog*__ is a powerful tool to launch your __load tests__ without any kind of limitation when it comes to choosing the level of load or the types of resources you want to test. 

Key features:
- __Friendly__: It is developed to provide the greatest possible simplicity to developers.
- __Familiar__: Tests are written in __*Javascript*__ and interpreted by the <a href="https://nodejs.org">Node.js</a> runtime.
- __Performance__: Optimized to reduce latencies when calculating the test suite scores.
- __Limitless__: It supports __any protocol__ that <a href="https://nodejs.org">Node.js</a> allows, you don't need to extend anything.


## Examples

Some load test scripts already developed can be found in the `./examples` folder of this repository.

You can run scripts like this on the CLI, or in your CI.

## Configuration

Create an `.env` file with your custom values:

```bash
# Amount of CPU threads executing the test scripts.
SCRIPT_PARALLELISM=2
# Number of iterations per second on each thread.
SCRIPT_ITERATIONS=4
# The path in which to find the scripts to be executed
WARTHOG_TESTS_PATH=./examples
# Amount of time in seconds during which the tests will be running
WARTHOG_DURATION=4000
```

Then you would be able edit `.env` for configuring your scripts running environment.

## Contribute

If you want to contribute or help with the development of Warthog, start by reading `CONTRIBUTING.md`.