from jobs.validator import is_yt_format

class TestValidator:
    def __init__(self):
        pass
    def test_is_yt_format(self):
        assert is_yt_format("https://www.youtube.com/watch?v=dQw4w9WgXcQ") == True
        assert is_yt_format("https://youtu.be/dQw4w9WgXcQ") == True
        assert is_yt_format("https://vimeo.com/123456") == False
        assert is_yt_format("https://www.example.com") == False

    def run_tests(self):
        self.test_is_yt_format()
        print("All tests passed!")

if __name__ == "__main__":
    tester = TestValidator()
    tester.run_tests()
        
        