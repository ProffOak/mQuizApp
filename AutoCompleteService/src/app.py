
from flask import Flask, request, jsonify
from fast_autocomplete import AutoComplete
from werkzeug.exceptions import Forbidden, HTTPException, NotFound, RequestTimeout, Unauthorized
import gzip
import json
import string
import os
import zipfile


app = Flask(__name__)

app.config['JSON_AS_ASCII'] = False



valid_chars = string.ascii_lowercase + string.punctuation + string.digits + 'åäö'

artist_file_path = './AutoCompleteService/Artist_data/Artists.zip'
song_file_path = './AutoCompleteService/Song_data/Songs.zip'


if not os.path.isfile(artist_file_path):
    artist_file_path = './Artist_data/Artists.zip'
    song_file_path = './Song_data/Songs.zip'

print ('hej')
print(os.path.isfile(artist_file_path))

#song_content_files = {
#    'words': {
#        'filepath': song_file_path,
#        'compress': True  # means compress the graph data in memory
#    }
#}

#song_autocomplete = autocomplete_factory(content_files=song_content_files)



with gzip.open(song_file_path, 'r') as fin:
    song_data = json.loads(fin.read().decode('utf-8'))

song_autocomplete = AutoComplete(words = song_data, valid_chars_for_string=valid_chars)
song_data = None
fin.close()

print('Song file loaded!')


#Load Autocomplete file
#artist_content_files = {
 #   'words': {
  #      'filepath': artist_file_path,
   #     'compress': True  # means compress the graph data in memory
    #}
#}

with gzip.open(artist_file_path, 'r') as fin:
    artist_data = json.loads(fin.read().decode('utf-8'))

artist_autocomplete = AutoComplete(words = artist_data, valid_chars_for_string=valid_chars)
artist_data = None
fin.close()

print('Artist file loaded!')




@app.route('/', methods=['GET'])
def hello_world():
    return jsonify({'message' : 'Hellö, World!'})

#Size currently hardcoded
@app.route('/artist/<string:input_string>', methods=['GET'])
def get_artist_autocomplete(input_string):
    artist_list = artist_autocomplete.search(word=input_string, size=7)
    return jsonify({'artists' : artist_list})


@app.route('/song/<string:input_string>', methods=['GET'])
def get_song_autocomplete(input_string):
    song_list = song_autocomplete.search(word=input_string, size=7)
    return jsonify({'song' : song_list}, )


@app.errorhandler(NotFound)
def page_not_found_handler(e: HTTPException):
    return jsonify({'error': '404 Not found'}), 404


@app.errorhandler(Unauthorized)
def unauthorized_handler(e: HTTPException):
    return jsonify({'error': 'Unauthorized'}), 401


@app.errorhandler(Forbidden)
def forbidden_handler(e: HTTPException):
    return jsonify({'error': 'Forbidden'}), 403


@app.errorhandler(RequestTimeout)
def request_timeout_handler(e: HTTPException):
    return jsonify({'error': 'RequestTimeout'}), 408


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8000)))