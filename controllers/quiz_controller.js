var models = require('../models/model.js');

exports.load = function(req,res,next,quizId){
	models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{model: models.Comment}]
	}).then(function(quiz){
		if(quiz){
			req.quiz = quiz;
			next();
		}else{
			next(new Error('No existe quizId = '+quizId));
		}
	}).catch(function(error){next(error);});
};

exports.show = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show',{quiz: req.quiz,errors:[]});
	})
};

exports.question = function(req,res){
models.Quiz.findAll().success(function(quiz){
	res.render('quizes/question',{pregunta:quiz[0].pregunta})
})

};

exports.answer = function(req,res){
	var resultado = 'Incorrecto';
	
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}

	res.render('quizes/answer',{quiz:req.quiz,respuesta:resultado,errors:[]});
};

exports.index = function(req,res){
	var busqueda='';

	if(req.query.search)
	{
		busqueda='%'+req.query.search+'%';
		busqueda=busqueda.replace(" ","%");

		models.Quiz.findAll({where:["pregunta like ?",busqueda]}).then(function(quizes){
			res.render('quizes/index',{quizes:quizes,errors:[]});
		})
	}else{
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index',{quizes:quizes,errors:[]});
		})
	}
};


exports.new = function(req,res){
	var quiz = models.Quiz.build({pregunta:"Pregunta",respuesta:"Respuesta"});

	req.session.user.last = Date.now();
	res.render('quizes/new',{quiz:quiz,errors:[]});
};

exports.create = function(req,res){
	var quiz = models.Quiz.build(req.body.quiz);

	req.session.user.last = Date.now();
	quiz.validate().then(function(err){
		if(err){
			res.render('quizes/new',{quiz:quiz,errors:err.errors});
		}else{
			quiz.save({fields:["pregunta","respuesta","tema"]}).then(function(){
				res.redirect('/quizes');
			})
		}
	});
};

exports.edit = function(req,res){
	var quiz = req.quiz;

	req.session.user.last = Date.now();
	res.render('quizes/edit',{quiz:quiz,errors:[]});
};

exports.update = function(req,res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.session.user.last = Date.now();
	
	req.quiz.validate().then(
		function(err){
			if(err){
				res.render('quizes/edit',{quiz:req.quiz,errors:err.errors});
			}else{
				req.quiz.save({fields:["pregunta","respuesta","tema"]})
				.then(function(){res.redirect('/quizes');});
			}
		}
		);
};

exports.destroy = function(req,res){
	req.session.user.last = Date.now();
	
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};