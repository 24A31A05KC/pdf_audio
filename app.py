import os
import io
from flask import Flask, render_template, request, jsonify, send_file
from pypdf import PdfReader
from gtts import gTTS

# Microsoft Word parsing dependencies engines layers setup parameters
import docx

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Global cache memory structure to retain both clean strings and uploaded filenames safely
text_cache = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/extract-text', methods=['POST'])
def extract_text():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    original_name = file.filename
    filename_lower = original_name.lower()
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], original_name)
    file.save(file_path)
    
    pages_text_list = []
    
    try:
        # ================= BRANCH 1: HIGH-SPEED PDF TEXT PARSER LAYER =================
        if filename_lower.endswith('.pdf'):
            with open(file_path, 'rb') as f:
                reader = PdfReader(f)
                for page in reader.pages:
                    try:
                        text = page.extract_text()
                        if text and text.strip():
                            pages_text_list.append(text.strip())
                        else:
                            pages_text_list.append("__IMAGE_DETECTED_WARNING_TRIGGER_FLAG__")
                    except Exception:
                        pages_text_list.append("__IMAGE_DETECTED_WARNING_TRIGGER_FLAG__")
                        
        # ================= BRANCH 2: SECURE MS-WORD DOCX STREAMER LAYER =================
        elif filename_lower.endswith('.docx'):
            doc_file_reader = docx.Document(file_path)
            current_chunk_buffer = []
            
            for paragraph in doc_file_reader.paragraphs:
                cleaned_paragraph_text = paragraph.text.strip()
                if cleaned_paragraph_text:
                    current_chunk_buffer.append(cleaned_paragraph_text)
                    
                # Standard paragraph counting constraints maps approx 1 printed layout sheet bounds limits
                if len(current_chunk_buffer) >= 16:
                    pages_text_list.append("\n".join(current_chunk_buffer))
                    current_chunk_buffer = []
                    
            if current_chunk_buffer:
                pages_text_list.append("\n".join(current_chunk_buffer))
                
        # ================= BRANCH 3: BINARY MS-WORD DOC EXTRACTOR FALLBACK LAYER =================
        elif filename_lower.endswith('.doc'):
            with open(file_path, 'rb') as f:
                raw_binary_bytes = f.read()
                # Use raw standard fallback bytes translation pipelines safely discarding structural crash artifacts
                decoded_raw_string = raw_binary_bytes.decode('utf-8', errors='ignore')
                
                filtered_lines_pool = [
                    line.strip() for line in decoded_raw_string.split('\n') 
                    if line.strip() and len(line.strip()) > 3 and not any(ch in line for ch in ['\x00', '\x01', '\x02'])
                ]
                
                current_chunk_buffer = []
                for valid_line in filtered_lines_pool:
                    current_chunk_buffer.append(valid_line)
                    if len(current_chunk_buffer) >= 18:
                        pages_text_list.append("\n".join(current_chunk_buffer))
                        current_chunk_buffer = []
                if current_chunk_buffer:
                    pages_text_list.append("\n".join(current_chunk_buffer))
        else:
            if os.path.exists(file_path): os.remove(file_path)
            return jsonify({'error': 'Unsupported file configuration type extension.'}), 400

        if os.path.exists(file_path):
            os.remove(file_path)
            
        if not pages_text_list:
            return jsonify({'error': 'Document strings arrays parsed empty values lines records.'}), 400
            
        # Clean values matching parameters maps inside memory caches registers profiles
        clean_payload_list = [
            p for p in pages_text_list 
            if p != "__IMAGE_DETECTED_WARNING_TRIGGER_FLAG__" and len(p.strip()) > 3
        ]
        
        # 🟢 STORE TARGET PAYLOAD AND DYNAMIC FILE SURNAME PATH MARKERS
        text_cache['latest'] = "\n".join(clean_payload_list) if clean_payload_list else "Empty registers blocks."
        
        # Extract name title strings strips out extensions patterns parameters format models bounds
        base_title_name = os.path.splitext(original_name)[0]
        text_cache['filename_prefix'] = base_title_name if base_title_name.strip() else "VoiceDoc_AI_Track"
        
        return jsonify({'pages': pages_text_list})
        
    except Exception as e:
        if os.path.exists(file_path): os.remove(file_path)
        return jsonify({'error': f"Failed to parse target multi-format document structural layouts models: {str(e)}"}), 500

@app.route('/download-audio', methods=['GET'])
def download_audio():
    text_payload = text_cache.get('latest', '').strip()
    # 🟢 FETCH CACHED EXPLICIT PREFIX FILE SURNAME DYNAMICALLY STRINGS RECORDS
    file_prefix_title = text_cache.get('filename_prefix', 'VoiceDoc_AI_Track')
    
    if not text_payload:
        text_payload = "Welcome user. Source document binary stream metadata content buffers are active."
        
    try:
        tts_compiler = gTTS(text=text_payload[:3500], lang='en', tld='co.in')
        mp3_buffer_io_stream = io.BytesIO()
        tts_compiler.write_to_fp(mp3_buffer_io_stream)
        mp3_buffer_io_stream.seek(0)
        
        # 🟢 INJECT REAL TIME NAMING IN THE HEADER DIRECT SAVE DISPOSITION ATTACHMENTS
        target_output_filename_string = f"{file_prefix_title}.mp3"
        
        return send_file(
            mp3_buffer_io_stream, 
            mimetype="audio/mp3", 
            as_attachment=True, 
            download_name=target_output_filename_string
        )
    except Exception as e:
        return f"Server audio compiler download pathway execution failure: {str(e)}", 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)