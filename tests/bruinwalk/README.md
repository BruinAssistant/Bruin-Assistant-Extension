# Bruinwalk Popup Unit Test

## Test #1: HTML does not contain a div that has professor name
### Objective:
    We want to check whether the professor name is included in bruinwalk.com or not. Given that we search course name on bruinwalk, the professor's name must be there (unless the review of him/her does not exist yet)

### Input:
    url: (dummy HTML that does not contain any information about professor)
    
    <!DOCTYPE html>
    <html><body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
    </body></html>

### Output:
    "" (empty string)

### Result:
![](./imgs/test1.png)