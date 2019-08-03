import unittest
from scrub import scrub_word, scrub_multi_word, scrub_whole_word


REDACTED = '$$$$$'
SOURCE = 'John Doe'
CHARS = !   *   '   (   )   ;   :   @   &   =   +   $   ,   /   ?   #   [   ]

class ScrubWordTests(unittest.TestCase):

    def test_basic(self):
        correct = REDACTED + ' Doe'
        assert scrub_word(SOURCE, 'John', REDACTED) == correct

    def test_case(self):
        correct = REDACTED + ' Doe'
        assert scrub_word(SOURCE, 'john', REDACTED) == correct

    def test_mult(self):
        source = SOURCE + ' john'
        correct = REDACTED + ' Doe ' + REDACTED
        assert scrub_word(source, 'john', REDACTED) == correct


class ScrubMultiWordTests(unittest.TestCase):
    correct = REDACTED + ' ' + REDACTED

    def test_basic(self):
        assert scrub_multi_word(SOURCE, 'John Doe', REDACTED) == self.correct

    def test_characters(self):
        chars = [',', '|', '-', '_', '/', '.', '(', ')', '[', ']', '%']
        for char in chars:
            keyword = 'John' + char + 'Doe'
            assert scrub_multi_word(SOURCE, keyword, REDACTED) == self.correct

    # def test_ssn_1(self):
    #     source = '123456789'
    #     correct = REDACTED + REDACTED + REDACTED
    #     assert scrub_multi_word(source, '123-45-6789', REDACTED) == correct

    def test_ssn_2(self):
        source = '123-45-6789'
        correct = '-'.join([REDACTED, REDACTED, REDACTED])
        assert scrub_multi_word(source, '123 45 6789', REDACTED) == correct


class ScrubWholeWordTests(unittest.TestCase):
    source = 'John E. Doe'

    
    def test_basic(self):
        correct = 'John ' + REDACTED + '. Doe'
        assert scrub_whole_word(self.source, 'E', REDACTED) == correct

    def test_end_of_string(self):
        correct = 'John E. ' + REDACTED
        assert scrub_whole_word(self.source, 'Doe', REDACTED) == correct

    def test_beginning_of_string(self):
        correct = REDACTED + ' E. Doe'
        assert scrub_whole_word(self.source, 'John', REDACTED) == correct

    def test_weird_chars(self):
        chars = [
            '-', '/', '&', '_', '|', '(', ')', '[', ']']
        for char in chars:
            s = 'e' + char
            correct = REDACTED + char
            assert scrub_whole_word(s, 'e', REDACTED) == correct
